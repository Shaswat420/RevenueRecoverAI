package com.revenuerecoverai.controller;

import com.revenuerecoverai.model.Payment;
import com.revenuerecoverai.repository.PaymentRepository;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
})
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
        this.restTemplate = new RestTemplate();
    }

    @GetMapping
    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }

    @PostMapping("/{id}/recommend")
    public Payment getRecommendation(@PathVariable Integer id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Map<String, Object> request = new HashMap<>();

        request.put("customer", payment.getCustomer());
        request.put("amount", payment.getAmount());
        request.put("reason", payment.getReason());
        request.put("successfulPayments", payment.getSuccessfulPayments());
        request.put("failedPayments", payment.getFailedPayments());
        request.put("lifetimeValue", payment.getLifetimeValue());
        request.put("daysSinceLastPayment", payment.getDaysSinceLastPayment());

        String aiServiceUrl =
                "http://host.docker.internal:8000/api/recommend";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        aiServiceUrl,
                        entity,
                        Map.class
                );

        Map<String, Object> recommendation = response.getBody();

        if (recommendation != null) {

            if (recommendation.get("recoveryScore") != null) {
                payment.setRecoveryScore(
                        ((Number) recommendation.get("recoveryScore")).intValue()
                );
            }

            if (recommendation.get("priority") != null) {
                payment.setPriority(
                        recommendation.get("priority").toString()
                );
            }

            if (recommendation.get("riskLevel") != null) {
                payment.setRiskLevel(
                        recommendation.get("riskLevel").toString()
                );
            }

            if (recommendation.get("recoveryProbability") != null) {
                payment.setRecoveryProbability(
                        recommendation.get("recoveryProbability").toString()
                );
            }

            if (recommendation.get("aiConfidence") != null) {
                payment.setAiConfidence(
                        ((Number) recommendation.get("aiConfidence")).intValue()
                );
            }

            if (recommendation.get("recommendedAction") != null) {
                payment.setRecommendedAction(
                        recommendation.get("recommendedAction").toString()
                );
            }

            if (recommendation.get("recommendationReason") != null) {
                payment.setRecommendationReason(
                        recommendation.get("recommendationReason").toString()
                );
            }

            if (recommendation.get("recoveryMessage") != null) {
                payment.setRecoveryMessage(
                        recommendation.get("recoveryMessage").toString()
                );
            }
        }

        return paymentRepository.save(payment);
    }

    @PostMapping("/{id}/recover")
    public Payment recoverPayment(@PathVariable Integer id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setRecovered(true);

        return paymentRepository.save(payment);
    }
}
