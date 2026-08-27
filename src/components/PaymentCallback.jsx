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
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

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

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl p-8 border border-gray-100 animate-in fade-in zoom-in duration-300">

          {loading && (
            <div className="text-center py-12 space-y-6">
              <div className="flex justify-center">
                <CircularProgress color="success" size={60} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Verifying Payment…
                </h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Please wait while we confirm your transaction securely with
                  Paystack. Do not close or refresh this page.
                </p>
              </div>
            </div>
          )}

          {!loading &&
            (paymentState.status === "TICKET_ISSUED" ||
              paymentState.status === "PAID") && (
              <div className="space-y-6 text-center">

                <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle size={44} />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 shadow-sm">
                    <Sparkles size={16} />
                  </span>
                </div>

                <div>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    {paymentState.status === "TICKET_ISSUED"
                      ? "Ticket Confirmed & Issued"
                      : "Payment Verified"}
                  </span>
                  <h1 className="text-3xl font-black text-gray-900">
                    Payment Successful!
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Your spot is confirmed!{" "}
                    {paymentState.order?.email && (
                      <>
                        A digital ticket has been sent to{" "}
                        <span className="font-semibold text-gray-700">
                          {paymentState.order.email}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>

                {paymentState.status === "TICKET_ISSUED" &&
                  paymentState.order?.ticketCode ? (
                  <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white text-left shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-200 text-xs font-bold uppercase tracking-wider">
                        <Ticket size={16} />
                        <span>Digital Event Ticket</span>
                      </div>
                      <span className="bg-green-600/80 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        Ready
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xl text-white">
                        {paymentState.order.event?.title || "Event Entry Pass"}
                      </h3>
                      <p className="text-green-100 text-sm mt-0.5">
                        Attendee: {paymentState.order.fullName}
                      </p>
                    </div>

                    <div className="bg-green-950/60 rounded-xl p-3 flex items-center justify-between border border-green-700/50">
                      <div>
                        <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider block">
                          Ticket Code
                        </span>
                        <span className="font-mono text-sm font-bold text-white tracking-wider">
                          {paymentState.order.ticketCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyTicketCode(paymentState.order.ticketCode)
                        }
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
                        title="Copy ticket code"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-white text-green-900 py-3.5 rounded-xl font-extrabold text-base hover:bg-green-50 shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                      <Download size={18} />
                      <span>Download Ticket PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left flex items-start gap-3">
                    <CircularProgress color="success" size={24} className="mt-1" />
                    <div>
                      <h4 className="font-bold text-green-900 text-sm">
                        Preparing your PDF ticket & QR code…
                      </h4>
                      <p className="text-xs text-green-700 mt-1">
                        Our server is generating your high resolution ticket PDF
                        and dispatching it to your email. This page will update
                        automatically in a few seconds.
                      </p>
                    </div>
                  </div>
                )}

                {paymentState.order && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4">
                    {paymentState.order.event && (
                      <div className="pb-4 border-b border-gray-200/70">
                        <h3 className="font-bold text-gray-900 text-base">
                          {paymentState.order.event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                          {paymentState.order.event.date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays size={13} className="text-green-600" />
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
                              <MapPin size={13} className="text-green-600" />
                              {paymentState.order.event.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-gray-400 block font-medium">
                          Attendee
                        </span>
                        <span className="font-semibold text-gray-800">
                          {paymentState.order.fullName}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-medium">
                          Email
                        </span>
                        <span className="font-semibold text-gray-800 truncate block">
                          {paymentState.order.email}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-medium">
                          Amount Paid
                        </span>
                        <span className="font-extrabold text-green-700">
                          KES {paymentState.order.ticketPrice?.toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-medium">
                          Payment Channel
                        </span>
                        <span className="font-semibold text-gray-800 capitalize">
                          {paymentState.order.paystackChannel || "Online Payment"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span>Reference</span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                        {reference}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 flex items-start gap-3 text-left">
                  <Mail
                    size={20}
                    className="text-green-700 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A copy of your ticket PDF has also been sent to{" "}
                    <strong className="text-gray-900">
                      {paymentState.order?.email}
                    </strong>
                    . You can present either the downloaded PDF or the emailed
                    attachment at the venue.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {paymentState.order?.event?._id ? (
                    <button
                      onClick={() =>
                        nav(`/events/${paymentState.order.event._id}`)
                      }
                      className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Return to Event Page</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => nav("/events")}
                      className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
                    >
                      Browse More Events
                    </button>
                  )}
                </div>
              </div>
            )}

          {!loading && paymentState.status === "PENDING" && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Clock size={44} />
              </div>

              <div>
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Payment Awaiting Confirmation
                </span>
                <h1 className="text-2xl font-black text-gray-900">
                  Payment Pending
                </h1>
                <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                  {paymentState.message}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-5 text-left text-xs text-amber-900 space-y-2">
                <p className="font-semibold">
                  Did you complete payment on your phone or card?
                </p>
                <p className="text-amber-800 leading-relaxed">
                  M-Pesa prompts usually take a few moments to confirm. Once
                  confirmed, your ticket will be generated automatically.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => verifyPayment(true)}
                  disabled={verifying}
                  className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={verifying ? "animate-spin" : ""}
                  />
                  <span>
                    {verifying ? "Checking Status…" : "Check Status Again"}
                  </span>
                </button>

                <button
                  onClick={() => nav("/events")}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  Return to Events
                </button>
              </div>
            </div>
          )}

          {!loading && paymentState.status === "FAILED" && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
                <XCircle size={44} />
              </div>

              <div>
                <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  Payment Incomplete
                </span>
                <h1 className="text-2xl font-black text-gray-900">
                  Payment Was Not Completed
                </h1>
                <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                  {paymentState.message}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {paymentState.order?.event?._id ? (
                  <button
                    onClick={() =>
                      nav(`/events/${paymentState.order.event._id}/ticket`)
                    }
                    className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} />
                    <span>Try Purchasing Ticket Again</span>
                  </button>
                ) : (
                  <button
                    onClick={() => nav("/events")}
                    className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all"
                  >
                    Browse Events
                  </button>
                )}

                <button
                  onClick={() => nav("/events")}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
          )}

          {/*ERROR / INVALID REFERENCE */}
          {!loading &&
            (paymentState.status === "ERROR" ||
              paymentState.status === "INVALID_REF") && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto text-yellow-600">
                  <AlertTriangle size={44} />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-gray-900">
                    Payment Verification Error
                  </h1>
                  <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                    {paymentState.message}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => nav("/events")}
                    className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all"
                  >
                    Return to Events
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
