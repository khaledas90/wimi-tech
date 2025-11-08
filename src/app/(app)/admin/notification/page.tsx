"use client";

import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import { userNotigication } from "@/app/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function User_NotificationPage() {
  const token = Cookies.get("token_admin");

  const [recive, setrecive] = useState<userNotigication[]>([]);
  const get_user_notification = `${BaseUrl}users/getMyNotification`;
  useEffect(() => {
    const getnotification = async () => {
      try {
        const res = await axios.get(get_user_notification, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Sort notifications by createdAt in descending order (newest first)
        const sortedNotifications = (res.data.data || []).sort(
          (a: userNotigication, b: userNotigication) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );
        setrecive(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getnotification();
  }, []);
  return (
    <section className="h-screen">
      <Container>
        <div className="max-w-2xl mx-auto mt-20 space-y-6 p-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            📩 إشعاراتك
          </h2>

          {recive.length === 0 ? (
            <div className="text-center text-gray-500 pb-14">
              لا توجد إشعارات جديدة حاليًا.
            </div>
          ) : (
            <div className="space-y-4">
              {recive.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-star t gap-3 p-4 bg-gray-400 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  {/* Icon based on type */}
                  <div className="text-2xl">
                    {notification.type === "alert"
                      ? "🚨"
                      : notification.type === "offer"
                      ? "🔥"
                      : notification.type === "info"
                      ? "ℹ️"
                      : "🔔"}
                  </div>

                  {/* Notification content */}
                  <div className="flex-1 ">
                    <p className="text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString(
                        "ar-EG",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
