from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="RevenueRecoverAI",
    description="AI-powered payment recovery recommendation service",
    version="1.0.0"
)


class Payment(BaseModel):
    customer: str
    amount: float
    reason: str
    successfulPayments: int
    failedPayments: int
    lifetimeValue: float
    daysSinceLastPayment: int


@app.get("/")
def home():
    return {
        "service": "RevenueRecoverAI AI Service",
        "status": "running"
    }


@app.post("/api/recommend")
def recommend(payment: Payment):

    reason = payment.reason.lower()

    # -----------------------------
    # Recovery Score
    # -----------------------------

    score = 50

    if payment.successfulPayments >= 10:
        score += 20

    if payment.failedPayments <= 1:
        score += 15

    if payment.daysSinceLastPayment <= 7:
        score += 10

    if payment.lifetimeValue >= 50000:
        score += 10

    score = min(score, 100)

    # -----------------------------
    # Recommendation
    # -----------------------------

    if "insufficient" in reason:

        action = "Retry payment and send reminder"

        explanation = (
            "The customer has a payment history suggesting "
            "that a retry may successfully recover the payment."
        )

    elif "expired" in reason:

        action = "Ask customer to update payment card"

        explanation = (
            "The payment card has expired, so updating the payment "
            "method is recommended before retrying."
        )

    elif "gateway" in reason:

        action = "Retry payment immediately"

        explanation = (
            "The failure appears to be a temporary payment gateway "
            "issue and the customer has strong payment behavior."
        )

    else:

        action = "Offer alternative payment method"

        explanation = (
            "An alternative payment method may improve the probability "
            "of recovering the failed payment."
        )

    # -----------------------------
    # Priority
    # -----------------------------

    if score >= 80:
        priority = "HIGH"
    elif score >= 50:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    # -----------------------------
    # Recovery Level
    # -----------------------------

    if score >= 80:
        risk_level = "High Recovery"
        recovery_probability = "80-100%"
        confidence = 95

    elif score >= 60:
        risk_level = "Moderate Recovery"
        recovery_probability = "60-79%"
        confidence = 85

    else:
        risk_level = "Low Recovery"
        recovery_probability = "40-59%"
        confidence = 70

    # -----------------------------
    # Personalized Recovery Message
    # -----------------------------

    recovery_message = (
        f"Hi {payment.customer}, we noticed that your recent payment "
        f"of {payment.amount:.0f} could not be completed. "
        f"Please try again or choose another payment method."
    )

    if "insufficient" in reason:

        recovery_message = (
            f"Hi {payment.customer}, we noticed that your recent payment "
            f"of {payment.amount:.0f} could not be completed due to "
            f"insufficient funds. Please try again or choose another "
            f"payment method."
        )

    elif "expired" in reason:

        recovery_message = (
            f"Hi {payment.customer}, your payment of "
            f"{payment.amount:.0f} could not be completed because your "
            f"payment card has expired. Please update your card details "
            f"so we can complete your payment."
        )

    elif "gateway" in reason:

        recovery_message = (
            f"Hi {payment.customer}, your recent payment of "
            f"{payment.amount:.0f} could not be completed because of "
            f"a temporary payment processing issue. Please try the "
            f"payment again."
        )

    return {
        "customer": payment.customer,
        "recoveryScore": score,
        "priority": priority,
        "riskLevel": risk_level,
        "recoveryProbability": recovery_probability,
        "aiConfidence": confidence,
        "recommendedAction": action,
        "recommendationReason": explanation,
        "recoveryMessage": recovery_message
    }
