"use client"

import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import { userNotigication } from "@/app/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import SmartNavbar from "@/app/components/ui/Navbar";

export default function User_NotificationPage() {
  const token = Cookies.get("token");

    const [recive,setrecive]=useState<userNotigication[]>([]);
    const get_user_notification = `${BaseUrl}users/getMyNotification`;
    useEffect(()=>{
        const getnotification = async () => {
            try{
                const res = await axios.get(get_user_notification, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setrecive(res.data.data);
            }
            catch(error){
                console.error("Error fetching notifications:", error);
            }
        }
        getnotification();
    },[])
  return (
    <section className=" bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]  h-screen">
        <div className="pb-10 ">

        <SmartNavbar/>
        </div>
    <Container>
      <div className="max-w-2xl mx-auto mt-20 space-y-6 p-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">📩 <span className="text-white">
            إشعاراتك
            </span>
            
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
                className="flex items-start gap-3 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Icon based on type */}
                <div className="text-2xl">
                  {notification.type === "alert" ? "🚨" :
                    notification.type === "offer" ? "🔥" :
                      notification.type === "info" ? "ℹ️" : "🔔"}
                </div>

                {/* Notification content */}
                <div className="flex-1">
                  <p className="text-gray-800">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString("ar-EG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
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