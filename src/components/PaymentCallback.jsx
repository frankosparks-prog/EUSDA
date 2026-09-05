import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CalendarDays,
  MapPin,
  Ticket,
  Download,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const styles = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
    .tk { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    .tk-serif { font-family: 'Fraunces', Georgia, serif; }
    .tk-ink { color: #2c4536ff; } .tk-muted { color: #6B7568; } .tk-gold { color: #C89B3C; }
    .tk-card { background: #FCFBF8; border: 1px solid #D7DCD2; border-radius: 20px; box-shadow: 0 1px 2px rgba(22,38,28,.04), 0 16px 40px -20px rgba(22,38,28,.22); }
    .tk-badge { font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; display: inline-block; }
    .tk-btn { background: #1F6F4A; transition: background-color .15s, transform .1s; }
    .tk-btn:hover:not(:disabled) { background: #17573A; }
    .tk-btn:active:not(:disabled) { transform: scale(.98); }
    .tk-btn:disabled { background: #A9B8AE; }
    .tk-btn-ghost { background: #EEF1EA; color: #16261C; transition: background-color .15s; }
    .tk-btn-ghost:hover { background: #E3E8DD; }
    .tk-icon-circle { width: 60px; height: 60px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
    @media (min-width: 640px) { .tk-icon-circle { width: 72px; height: 72px; } }
    .tk-stub { background: #1F6F4A; color: #F4F6F1; border-radius: 16px; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `}</style>
);

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const reference =
    searchParams.get("reference") || searchParams.get("trxref");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentState, setPaymentState] = useState({
    status: "VERIFYING", // 'TICKET_ISSUED', 'PAID', 'PENDING', 'FAILED', 'ERROR', 'INVALID_REF'
    message: "",
    order: null,
  });

  const pollTimerRef = useRef(null);

  const verifyPayment = useCallback(
    async (isRetry = false) => {
      if (!reference) {
        setPaymentState({
          status: "INVALID_REF",
          message: "No payment transaction reference found in the URL.",
          order: null,
        });
        setLoading(false);
        return;
      }

      if (isRetry) {
        setVerifying(true);
      }

      try {
        const { data } = await axios.get(
          `${SERVER_URL}/api/ticket-orders/verify/${encodeURIComponent(
            reference
          )}`
        );

        const currentStatus = data.status || data.order?.status;

        if (currentStatus === "TICKET_ISSUED") {
          setPaymentState({
            status: "TICKET_ISSUED",
            message: data.message || "Your ticket has been issued and emailed!",
            order: data.order,
          });
        } else if (currentStatus === "PAID") {
          setPaymentState({
            status: "PAID",
            message:
              data.message ||
              "Payment confirmed! We are generating your ticket and QR code…",
            order: data.order,
          });

          // If status is PAID: ticket generation in progress
          if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
          pollTimerRef.current = setTimeout(() => {
            verifyPayment(false);
          }, 3500);
        } else if (currentStatus === "PENDING") {
          setPaymentState({
            status: "PENDING",
            message:
              data.message ||
              "Your payment is still being processed by Paystack or M-Pesa.",
            order: data.order,
          });
        } else {
          setPaymentState({
            status: "FAILED",
            message:
              data.message || "Payment could not be completed successfully.",
            order: data.order,
          });
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        const errorMsg =
          err.response?.data?.error ||
          "Unable to verify payment with the server. Please check your connection.";

        setPaymentState({
          status: "ERROR",
          message: errorMsg,
          order: null,
        });
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    },
    [reference]
  );

  useEffect(() => {
    verifyPayment();

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [verifyPayment]);

  const copyTicketCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!paymentState.order?.ticketCode) return;
    const downloadUrl = `${SERVER_URL}/api/ticket-orders/download/${paymentState.order.ticketCode}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Payment & Ticket Status | EUSDA</title>
        <meta
          name="description"
          content="Payment verification and digital ticket download for EUSDA event."
        />
      </Helmet>

      <div className="tk min-h-screen flex justify-center px-3 sm:px-4 pt-3 sm:pt-4 pb-10" style={{ background: "#F4F6F1" }}>
        <div className="tk-card max-w-xl w-full p-5 sm:p-8 h-fit">

          {loading && (
            <div className="text-center py-6 sm:py-10 space-y-5">
              <div className="flex justify-center">
                <CircularProgress style={{ color: "#1F6F4A" }} size={52} />
              </div>
              <div>
                <h2 className="tk-serif text-2xl font-semibold tk-ink mb-2">
                  Verifying payment…
                </h2>
                <p className="tk-muted text-sm max-w-md mx-auto">
                  Please wait while we confirm your transaction securely with
                  Paystack. Do not close or refresh this page.
                </p>
              </div>
            </div>
          )}

          {!loading &&
            (paymentState.status === "TICKET_ISSUED" ||
              paymentState.status === "PAID") && (
              <div className="space-y-4 sm:space-y-5 text-center">

                <div className="tk-icon-circle" style={{ background: "#E7F0EA", color: "#1F6F4A" }}>
                  <CheckCircle size={30} className="sm:hidden" />
                  <CheckCircle size={34} className="hidden sm:block" />
                </div>

                <div>
                  <span className="tk-badge mb-2" style={{ background: "#E7F0EA", color: "#175A3A" }}>
                    {paymentState.status === "TICKET_ISSUED"
                      ? "Ticket confirmed & issued"
                      : "Payment verified"}
                  </span>
                  <h1 className="tk-serif text-2xl sm:text-3xl font-semibold tk-ink">
                    Payment successful
                  </h1>
                  <p className="tk-muted text-sm mt-1">
                    Your spot is confirmed.{" "}
                    {paymentState.order?.email && (
                      <>
                        A digital ticket has been sent to{" "}
                        <span className="font-medium tk-ink">
                          {paymentState.order.email}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>

                {paymentState.status === "TICKET_ISSUED" &&
                  paymentState.order?.ticketCode ? (
                  <div className="tk-stub p-4 sm:p-6 text-left space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#BFE0CC" }}>
                        <Ticket size={15} />
                        <span>Digital event ticket</span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: "rgba(255,255,255,.14)" }}>
                        Ready
                      </span>
                    </div>

                    <div>
                      <h3 className="tk-serif text-lg sm:text-xl break-words">
                        {paymentState.order.event?.title || "Event Entry Pass"}
                      </h3>
                      <p className="text-sm mt-0.5 break-words" style={{ color: "#BFE0CC" }}>
                        Attendee: {paymentState.order.fullName}
                      </p>
                    </div>

                    <div className="rounded-xl p-3 flex items-center justify-between gap-2" style={{ background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.12)" }}>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: "#BFE0CC" }}>
                          Ticket code
                        </span>
                        <span className="tk-serif text-sm tracking-wide break-all">
                          {paymentState.order.ticketCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyTicketCode(paymentState.order.ticketCode)
                        }
                        className="p-2 rounded-lg transition-colors flex-shrink-0"
                        style={{ background: "rgba(255,255,255,.12)" }}
                        title="Copy ticket code"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[.98]"
                      style={{ color: "#123626" }}
                    >
                      <Download size={17} />
                      <span>Download ticket PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl p-5 text-left flex items-start gap-3" style={{ background: "#F3F0E1", border: "1px solid #E4DCC3" }}>
                    <CircularProgress style={{ color: "#C89B3C" }} size={22} className="mt-1" />
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: "#7A5D1E" }}>
                        Preparing your PDF ticket & QR code…
                      </h4>
                      <p className="text-xs mt-1" style={{ color: "#8C6E28" }}>
                        Our server is generating your high resolution ticket PDF
                        and dispatching it to your email. This page will update
                        automatically in a few seconds.
                      </p>
                    </div>
                  </div>
                )}

                {paymentState.order && (
                  <div className="rounded-2xl p-4 sm:p-6 text-left space-y-4" style={{ background: "#F6F7F3", border: "1px solid #E5E9E0" }}>
                    {paymentState.order.event && (
                      <div className="pb-4" style={{ borderBottom: "1px solid #E5E9E0" }}>
                        <h3 className="font-semibold tk-ink text-base">
                          {paymentState.order.event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-xs tk-muted mt-2">
                          {paymentState.order.event.date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays size={13} style={{ color: "#1F6F4A" }} />
                              {new Date(
                                paymentState.order.event.date
                              ).toLocaleDateString("en-KE", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          {paymentState.order.event.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin size={13} style={{ color: "#1F6F4A" }} />
                              {paymentState.order.event.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs tk-muted block font-medium">
                          Attendee
                        </span>
                        <span className="font-medium tk-ink">
                          {paymentState.order.fullName}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs tk-muted block font-medium">
                          Email
                        </span>
                        <span className="font-medium tk-ink break-words block">
                          {paymentState.order.email}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs tk-muted block font-medium">
                          Amount paid
                        </span>
                        <span className="font-semibold" style={{ color: "#1F6F4A" }}>
                          KES {paymentState.order.ticketPrice?.toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs tk-muted block font-medium">
                          Payment channel
                        </span>
                        <span className="font-medium tk-ink capitalize">
                          {paymentState.order.paystackChannel || "Online payment"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs tk-muted" style={{ borderTop: "1px solid #E5E9E0" }}>
                      <span>Reference</span>
                      <span className="px-2 py-0.5 rounded break-all" style={{ background: "#E5E9E0", color: "#16261C" }}>
                        {reference}
                      </span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl p-4 flex items-start gap-3 text-left" style={{ background: "#F6F7F3", border: "1px solid #E5E9E0" }}>
                  <Mail size={19} className="flex-shrink-0 mt-0.5" style={{ color: "#1F6F4A" }} />
                  <p className="text-xs tk-muted leading-relaxed">
                    A copy of your ticket PDF has also been sent to{" "}
                    <strong className="tk-ink">
                      {paymentState.order?.email}
                    </strong>
                    . You can present either the downloaded PDF or the emailed
                    attachment at the venue.
                  </p>
                </div>

                <div className="pt-1">
                  {paymentState.order?.event?._id ? (
                    <button
                      onClick={() =>
                        nav(`/events/${paymentState.order.event._id}`)
                      }
                      className="tk-btn-ghost w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <span>Return to event page</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => nav("/events")}
                      className="tk-btn-ghost w-full py-3 rounded-xl font-semibold text-sm"
                    >
                      Browse more events
                    </button>
                  )}
                </div>
              </div>
            )}

          {!loading && paymentState.status === "PENDING" && (
            <div className="space-y-4 sm:space-y-5 text-center">
              <div className="tk-icon-circle" style={{ background: "#F3F0E1", color: "#B98B2E" }}>
                <Clock size={30} className="sm:hidden" />
                <Clock size={34} className="hidden sm:block" />
              </div>

              <div>
                <span className="tk-badge mb-2" style={{ background: "#F3F0E1", color: "#8C6E28" }}>
                  Payment awaiting confirmation
                </span>
                <h1 className="tk-serif text-2xl font-semibold tk-ink">
                  Payment pending
                </h1>
                <p className="tk-muted text-sm mt-2 max-w-md mx-auto">
                  {paymentState.message}
                </p>
              </div>

              <div className="rounded-2xl p-5 text-left text-xs space-y-2" style={{ background: "#F3F0E1", border: "1px solid #E4DCC3", color: "#7A5D1E" }}>
                <p className="font-semibold">
                  Did you complete payment on your phone or card?
                </p>
                <p className="leading-relaxed" style={{ color: "#8C6E28" }}>
                  M-Pesa prompts usually take a few moments to confirm. Once
                  confirmed, your ticket will be generated automatically.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => verifyPayment(true)}
                  disabled={verifying}
                  className="tk-btn w-full text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw
                    size={16}
                    className={verifying ? "animate-spin" : ""}
                  />
                  <span>
                    {verifying ? "Checking status…" : "Check status again"}
                  </span>
                </button>

                <button
                  onClick={() => nav("/events")}
                  className="w-full text-sm tk-muted py-2"
                >
                  Return to events
                </button>
              </div>
            </div>
          )}

          {!loading && paymentState.status === "FAILED" && (
            <div className="space-y-4 sm:space-y-5 text-center">
              <div className="tk-icon-circle" style={{ background: "#F7E9E5", color: "#B3452C" }}>
                <XCircle size={30} className="sm:hidden" />
                <XCircle size={34} className="hidden sm:block" />
              </div>

              <div>
                <span className="tk-badge mb-2" style={{ background: "#F7E9E5", color: "#93361F" }}>
                  Payment incomplete
                </span>
                <h1 className="tk-serif text-2xl font-semibold tk-ink">
                  Payment was not completed
                </h1>
                <p className="tk-muted text-sm mt-2 max-w-md mx-auto">
                  {paymentState.message}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {paymentState.order?.event?._id ? (
                  <button
                    onClick={() =>
                      nav(`/events/${paymentState.order.event._id}/ticket`)
                    }
                    className="tk-btn w-full text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} />
                    <span>Try purchasing ticket again</span>
                  </button>
                ) : (
                  <button
                    onClick={() => nav("/events")}
                    className="tk-btn w-full text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    Browse events
                  </button>
                )}

                <button
                  onClick={() => nav("/events")}
                  className="w-full text-sm tk-muted py-2"
                >
                  Back to events
                </button>
              </div>
            </div>
          )}

          {/*ERROR / INVALID REFERENCE */}
          {!loading &&
            (paymentState.status === "ERROR" ||
              paymentState.status === "INVALID_REF") && (
              <div className="space-y-4 sm:space-y-5 text-center">
                <div className="tk-icon-circle" style={{ background: "#F3F0E1", color: "#B98B2E" }}>
                  <AlertTriangle size={30} className="sm:hidden" />
                  <AlertTriangle size={34} className="hidden sm:block" />
                </div>

                <div>
                  <h1 className="tk-serif text-2xl font-semibold tk-ink">
                    Payment verification error
                  </h1>
                  <p className="tk-muted text-sm mt-2 max-w-md mx-auto">
                    {paymentState.message}
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => nav("/events")}
                    className="tk-btn w-full text-white py-3 rounded-xl font-semibold text-sm"
                  >
                    Return to events
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
      {styles}
    </>
  );
}