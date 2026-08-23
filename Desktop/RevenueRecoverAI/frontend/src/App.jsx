import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/payments";

function App() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loadingRecommendation, setLoadingRecommendation] = useState(null);
  const [recovering, setRecovering] = useState(null);
  const [error, setError] = useState("");

  const loadPayments = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load payments");
      }

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const refreshPayments = async () => {
    setRefreshing(true);
    await loadPayments();
  };

  const getRecommendation = async (id) => {
    try {
      setLoadingRecommendation(id);
      setError("");

      const response = await fetch(`${API_URL}/${id}/recommend`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendation");
      }

      const updatedPayment = await response.json();

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not generate AI recommendation.");
    } finally {
      setLoadingRecommendation(null);
    }
  };

  const recoverPayment = async (id) => {
    try {
      setRecovering(id);
      setError("");

      const response = await fetch(`${API_URL}/${id}/recover`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to recover payment");
      }

      const updatedPayment = await response.json();

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not mark payment as recovered.");
    } finally {
      setRecovering(null);
    }
  };

  const stats = useMemo(() => {
    const failedPayments = payments.filter((payment) => !payment.recovered);

    const amountAtRisk = failedPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const recoveredRevenue = payments
      .filter((payment) => payment.recovered)
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);

    const highPriority = failedPayments.filter(
      (payment) => payment.priority === "HIGH"
    ).length;

    const recoveryRate =
      payments.length === 0
        ? 0
        : Math.round((payments.filter((p) => p.recovered).length / payments.length) * 100);

    return {
      failedCount: failedPayments.length,
      amountAtRisk,
      recoveredRevenue,
      highPriority,
      recoveryRate,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    switch (activeFilter) {
      case "HIGH":
        return payments.filter((payment) => payment.priority === "HIGH");

      case "MEDIUM":
        return payments.filter((payment) => payment.priority === "MEDIUM");

      case "LOW":
        return payments.filter((payment) => payment.priority === "LOW");

      case "RECOVERED":
        return payments.filter((payment) => payment.recovered);

      default:
        return payments;
    }
  }, [payments, activeFilter]);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getPriorityClass = (priority) => {
    if (priority === "HIGH") return "high";
    if (priority === "MEDIUM") return "medium";
    return "low";
  };

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) return "low";

    if (riskLevel.toLowerCase().includes("high")) {
      return "high";
    }

    if (riskLevel.toLowerCase().includes("medium")) {
      return "medium";
    }

    return "low";
  };

  const getProbability = (payment) => {
    if (payment.recoveryProbability) {
      return payment.recoveryProbability;
    }

    const score = Number(payment.recoveryScore || 0);

    if (score >= 80) return "80-100%";
    if (score >= 50) return "40-59%";
    return "0-39%";
  };

  const getConfidence = (payment) => {
    if (payment.aiConfidence !== undefined && payment.aiConfidence !== null) {
      return payment.aiConfidence;
    }

    const score = Number(payment.recoveryScore || 0);

    if (score >= 80) return 95;
    if (score >= 50) return 70;
    return 55;
  };

  const getLastPaymentText = (days) => {
    if (days === undefined || days === null) return "—";

    if (days === 0) return "Today";
    if (days === 1) return "1d ago";

    return `${days}d ago`;
  };

  const filterCounts = {
    ALL: payments.length,
    HIGH: payments.filter((p) => p.priority === "HIGH").length,
    MEDIUM: payments.filter((p) => p.priority === "MEDIUM").length,
    LOW: payments.filter((p) => p.priority === "LOW").length,
    RECOVERED: payments.filter((p) => p.recovered).length,
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div>
            <h1>RevenueRecover AI</h1>
            <p>AI-powered payment recovery platform</p>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={refreshPayments}
          disabled={refreshing}
        >
          <span className={refreshing ? "spin" : ""}>↻</span>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <div className="eyebrow">AI RECOVERY ENGINE</div>

            <h2>Recover more revenue with intelligent actions.</h2>

            <p>
              Analyze failed payments, prioritize recovery opportunities, and
              generate personalized recovery strategies.
            </p>
          </div>

          <div className="hero-badge">
            <span>AI</span>
            <strong>Recovery Intelligence</strong>
            <small>Powered by your payment data</small>
          </div>
        </section>

        {error && (
          <div className="error-box">
            <span>!</span>
            <div>
              <strong>Connection issue</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="stats-grid">
          <StatCard
            icon="%"
            label="Recovery Rate"
            value={`${stats.recoveryRate}%`}
            description="Live performance"
          />

          <StatCard
            icon="!"
            label="Failed Payments"
            value={stats.failedCount}
            description="Requires attention"
          />

          <StatCard
            icon="₹"
            label="Amount at Risk"
            value={formatCurrency(stats.amountAtRisk)}
            description="Outstanding revenue"
          />

          <StatCard
            icon="⚡"
            label="High Priority"
            value={stats.highPriority}
            description="Best recovery opportunities"
          />

          <StatCard
            icon="✓"
            label="Recovered Revenue"
            value={formatCurrency(stats.recoveredRevenue)}
            description={`${stats.recoveryRate}% recovery rate`}
          />
        </section>

        <section className="operations">
          <div className="section-heading">
            <div>
              <div className="eyebrow">RECOVERY OPERATIONS</div>

              <h2>Payment Recovery Queue</h2>

              <p>
                AI-generated recommendations for recovering failed payments.
              </p>
            </div>

            <div className="payment-count">
              {payments.length} payments
            </div>
          </div>

          <div className="filters">
            <FilterButton
              label="All"
              count={filterCounts.ALL}
              active={activeFilter === "ALL"}
              onClick={() => setActiveFilter("ALL")}
            />

            <FilterButton
              label="High"
              count={filterCounts.HIGH}
              active={activeFilter === "HIGH"}
              onClick={() => setActiveFilter("HIGH")}
            />

            <FilterButton
              label="Medium"
              count={filterCounts.MEDIUM}
              active={activeFilter === "MEDIUM"}
              onClick={() => setActiveFilter("MEDIUM")}
            />

            <FilterButton
              label="Low"
              count={filterCounts.LOW}
              active={activeFilter === "LOW"}
              onClick={() => setActiveFilter("LOW")}
            />

            <FilterButton
              label="Recovered"
              count={filterCounts.RECOVERED}
              active={activeFilter === "RECOVERED"}
              onClick={() => setActiveFilter("RECOVERED")}
            />
          </div>

          {loading ? (
            <div className="loading">
              <div className="loader"></div>
              <p>Loading payment recovery data...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No payments found</h3>
              <p>There are no payments in this category.</p>
            </div>
          ) : (
            <div className="payment-list">
              {filteredPayments.map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  loadingRecommendation={loadingRecommendation}
                  recovering={recovering}
                  onRecommend={getRecommendation}
                  onRecover={recoverPayment}
                  formatCurrency={formatCurrency}
                  getInitial={getInitial}
                  getPriorityClass={getPriorityClass}
                  getRiskClass={getRiskClass}
                  getProbability={getProbability}
                  getConfidence={getConfidence}
                  getLastPaymentText={getLastPaymentText}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <span>RevenueRecover AI</span>
        <span>AI-powered payment recovery platform</span>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, description }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

function FilterButton({ label, count, active, onClick }) {
  return (
    <button
      className={`filter-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
      <span>{count}</span>
    </button>
  );
}

function PaymentCard({
  payment,
  loadingRecommendation,
  recovering,
  onRecommend,
  onRecover,
  formatCurrency,
  getInitial,
  getPriorityClass,
  getRiskClass,
  getProbability,
  getConfidence,
  getLastPaymentText,
}) {
  const score = Number(payment.recoveryScore || 0);
  const priorityClass = getPriorityClass(payment.priority);
  const riskClass = getRiskClass(payment.riskLevel);

  return (
    <article className={`payment-card ${payment.recovered ? "recovered" : ""}`}>
      <div className="payment-top">
        <div className="customer">
          <div className="avatar">{getInitial(payment.customer)}</div>

          <div className="customer-info">
            <h3>{payment.customer}</h3>
            <p>{payment.reason}</p>
          </div>
        </div>

        <div className={`priority ${priorityClass}`}>
          {payment.priority || "LOW"}
        </div>
      </div>

      <div className="payment-summary">
        <div className="amount-block">
          <span>PAYMENT AMOUNT</span>
          <strong>{formatCurrency(payment.amount)}</strong>
        </div>

        <div className="last-payment">
          <span>LAST PAYMENT</span>
          <strong>
            {getLastPaymentText(payment.daysSinceLastPayment)}
          </strong>
        </div>
      </div>

      <div className="customer-metrics">
        <Metric
          label="Recovery Score"
          value={`${score}/100`}
          highlight
        />

        <Metric
          label="Successful"
          value={payment.successfulPayments}
        />

        <Metric
          label="Failed"
          value={payment.failedPayments}
        />

        <Metric
          label="Lifetime Value"
          value={formatCurrency(payment.lifetimeValue)}
        />
      </div>

      <div className="recommendation">
        <div className="recommendation-header">
          <div>
            <span className="sparkle">✦</span>
            <span className="recommendation-label">
              AI RECOMMENDATION
            </span>
          </div>

          <span className="recommendation-tag">
            Recovery intelligence
          </span>
        </div>

        {payment.recommendedAction ? (
          <>
            <h4>{payment.recommendedAction}</h4>

            <p className="recommendation-reason">
              {payment.recommendationReason ||
                "AI analysis recommends this recovery strategy based on customer payment behavior."}
            </p>

            <div className="ai-metrics">
              <div>
                <span>Recovery Probability</span>
                <strong>{getProbability(payment)}</strong>
              </div>

              <div>
                <span>AI Confidence</span>
                <strong>{getConfidence(payment)}%</strong>
              </div>
            </div>
          </>
        ) : (
          <div className="no-recommendation">
            <p>
              Generate an AI recommendation to analyze this failed payment.
            </p>
          </div>
        )}

        <button
          className="recommend-button"
          onClick={() => onRecommend(payment.id)}
          disabled={loadingRecommendation === payment.id}
        >
          <span>✦</span>

          {loadingRecommendation === payment.id
            ? "Generating..."
            : "Get AI Recommendation"}
        </button>
      </div>

      {payment.recoveryMessage && (
        <div className="message-box">
          <div className="message-header">
            <span>Recovery Message</span>
            <small>AI Generated</small>
          </div>

          <p>{payment.recoveryMessage}</p>
        </div>
      )}

      <div className="payment-actions">
        <span className={`risk-badge ${riskClass}`}>
          {payment.riskLevel || "Recovery"}
        </span>

        {payment.recovered ? (
          <button className="recovered-button" disabled>
            ✓ Recovered
          </button>
        ) : (
          <button
            className="recover-button"
            onClick={() => onRecover(payment.id)}
            disabled={recovering === payment.id}
          >
            {recovering === payment.id
              ? "Recovering..."
              : "Recover Payment →"}
          </button>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={highlight ? "metric-highlight" : ""}>
        {value}
      </strong>
    </div>
  );
}

export default App;