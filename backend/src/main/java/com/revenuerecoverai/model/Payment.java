package com.revenuerecoverai.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String customer;
    private double amount;
    private String reason;

    private int successfulPayments;
    private int failedPayments;
    private double lifetimeValue;
    private int daysSinceLastPayment;

    private int recoveryScore;
    private String priority;
    private String riskLevel;

    private String recoveryProbability;
    private int aiConfidence;

    private String recommendedAction;
    private String recommendationReason;
    private String recoveryMessage;

    private boolean recovered;

    public Payment() {
    }

    public Payment(
            int id,
            String customer,
            double amount,
            String reason,
            int successfulPayments,
            int failedPayments,
            double lifetimeValue,
            int daysSinceLastPayment
    ) {
        this.id = id;
        this.customer = customer;
        this.amount = amount;
        this.reason = reason;
        this.successfulPayments = successfulPayments;
        this.failedPayments = failedPayments;
        this.lifetimeValue = lifetimeValue;
        this.daysSinceLastPayment = daysSinceLastPayment;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public int getSuccessfulPayments() {
        return successfulPayments;
    }

    public void setSuccessfulPayments(int successfulPayments) {
        this.successfulPayments = successfulPayments;
    }

    public int getFailedPayments() {
        return failedPayments;
    }

    public void setFailedPayments(int failedPayments) {
        this.failedPayments = failedPayments;
    }

    public double getLifetimeValue() {
        return lifetimeValue;
    }

    public void setLifetimeValue(double lifetimeValue) {
        this.lifetimeValue = lifetimeValue;
    }

    public int getDaysSinceLastPayment() {
        return daysSinceLastPayment;
    }

    public void setDaysSinceLastPayment(int daysSinceLastPayment) {
        this.daysSinceLastPayment = daysSinceLastPayment;
    }

    public int getRecoveryScore() {
        return recoveryScore;
    }

    public void setRecoveryScore(int recoveryScore) {
        this.recoveryScore = recoveryScore;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getRecoveryProbability() {
        return recoveryProbability;
    }

    public void setRecoveryProbability(String recoveryProbability) {
        this.recoveryProbability = recoveryProbability;
    }

    public int getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(int aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }

    public String getRecoveryMessage() {
        return recoveryMessage;
    }

    public void setRecoveryMessage(String recoveryMessage) {
        this.recoveryMessage = recoveryMessage;
    }

    public boolean isRecovered() {
        return recovered;
    }

    public void setRecovered(boolean recovered) {
        this.recovered = recovered;
    }
}
