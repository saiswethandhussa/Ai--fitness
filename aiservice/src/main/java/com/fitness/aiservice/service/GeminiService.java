package com.fitness.aiservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {
 private final WebClient webClient;

 @Value("${gemini.api.url}")
 private String geminiApiUrl;
 @Value("${gemini.api.key}")
 private String geminiApiKey;
 public GeminiService(WebClient.Builder webClientBuilder){
  this.webClient=webClientBuilder.build();
 }

 public String getAnswer(String question){
  String apiUrl = geminiApiUrl == null ? "" : geminiApiUrl.trim();
  String apiKey = geminiApiKey == null ? "" : geminiApiKey.trim();
  if (apiUrl.isBlank() || apiKey.isBlank()) {
   throw new IllegalStateException("Gemini API URL/key is missing. Set GEMINI_API_URL and GEMINI_API_KEY.");
  }

  Map<String, Object> requestBody= Map.of(
    "contents", new Object[]{
            Map.of("parts",new Object[]{
                    Map.of("text",question)
            })
          }
  );
  log.debug("Calling Gemini API at {}", apiUrl);
  String response = webClient.post()
          .uri(apiUrl + apiKey)
          .header("Content-Type","application/json")
          .bodyValue(requestBody)
          .retrieve()
          .onStatus(
                  status -> status.isError(),
                  clientResponse -> clientResponse.bodyToMono(String.class)
                          .flatMap(errorBody -> {
                           HttpStatusCode statusCode = clientResponse.statusCode();
                           if (isRetryableStatus(statusCode.value())) {
                            log.warn("Gemini API temporary failure with status {}. Retrying if attempts remain.",
                                    statusCode.value());
                           } else {
                            log.error("Gemini API returned an error: {}", errorBody);
                           }
                           return reactor.core.publisher.Mono.error(
                                   new GeminiApiException(statusCode.value(), getErrorMessage(statusCode.value())));
                          })
          )
          .bodyToMono(String.class)
          .retryWhen(Retry.backoff(2, Duration.ofSeconds(2))
                  .filter(error -> error instanceof GeminiApiException geminiError && geminiError.isRetryable())
                  .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> retrySignal.failure()))
          .block();
  return response;
 }

 private String getErrorMessage(int statusCode) {
  return switch (statusCode) {
   case 400, 401, 403 -> "Gemini API request failed. Check GEMINI_API_KEY and Gemini API access.";
   case 429 -> "Gemini API rate limit reached. Please try again after some time.";
   case 503 -> "Gemini model is temporarily overloaded. Please try again later.";
   default -> "Gemini API request failed with status " + statusCode + ".";
  };
 }

 private boolean isRetryableStatus(int statusCode) {
  return statusCode == 429 || statusCode >= 500;
 }

 private static class GeminiApiException extends RuntimeException {
  private final int statusCode;

  GeminiApiException(int statusCode, String message) {
   super(message);
   this.statusCode = statusCode;
  }

  boolean isRetryable() {
   return statusCode == 429 || statusCode >= 500;
  }
 }
}
