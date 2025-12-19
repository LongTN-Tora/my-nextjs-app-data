'use client';

import Link from "next/link";
import { useState, FormEvent } from "react";

export default function About() {
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [requester, setRequester] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [workType, setWorkType] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [subtotal, setSubtotal] = useState<number | "">("");
  const [tax, setTax] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CustomerName: customerName,
          ProjectName: projectName,
          Requester: requester,
          CustomerEmail: customerEmail,
          WorkType: workType,
          Quantity: quantity === "" ? undefined : Number(quantity),
          Unit: unit,
          UnitPrice: unitPrice === "" ? undefined : Number(unitPrice),
          Subtotal: subtotal === "" ? undefined : Number(subtotal),
          Tax: tax === "" ? undefined : Number(tax),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || data.error || "Failed to register data");
      } else {
        setMessage("Registration successful.");
        setCustomerName("");
        setProjectName("");
        setRequester("");
        setCustomerEmail("");
        setWorkType("");
        setQuantity("");
        setUnit("");
        setUnitPrice("");
        setSubtotal("");
        setTax("");
      }
    } catch (err) {
      setError(
        "Lỗi khi gọi API: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/" style={{ color: "#0070f3", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>

      <h1><b>Register Estimate (Power Apps)</b></h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <label>
          CustomerName
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          ProjectName
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Requester
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          CustomerEmail
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          WorkType
          <input
            type="text"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Unit
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          UnitPrice
          <input
            type="number"
            value={unitPrice}
            onChange={(e) =>
              setUnitPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Subtotal
          <input
            type="number"
            value={subtotal}
            onChange={(e) =>
              setSubtotal(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <label>
          Tax
          <input
            type="number"
            value={tax}
            onChange={(e) =>
              setTax(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.25rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: 4,
            backgroundColor: "#ecfdf3",
            color: "#166534",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: 4,
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
