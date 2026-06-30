package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

   private  final ActivityAIService aiService;
   private  final RecommendationRepository recommendationRepository;
    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public  void processActivity(Activity activity){
        try {
            log.info("Received activity for processing: {}", activity.getId());
            Recommendation recommendation = aiService.generateRecommendation(activity);
            recommendationRepository.save(recommendation);
            log.info("Generated recommendation for activity: {}", activity.getId());
            log.debug("Recommendation response: {}", recommendation);
        } catch (Exception ex) {
            log.error("Failed to process activity message. Message will not be requeued. Activity id: {}, reason: {}",
                    activity.getId(), ex.getMessage());
            log.debug("Activity processing failure details", ex);
        }
    }
}
