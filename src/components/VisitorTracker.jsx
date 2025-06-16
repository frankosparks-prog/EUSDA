import { useEffect } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch(`${SERVER_URL}/api/visitors/track-visitor`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Error tracking visit:", err);
      }
    };

    trackVisit();
  }, []);

  return null;
};

export default VisitorTracker;
