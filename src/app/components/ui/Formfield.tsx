"use client";

import { useEffect, useState } from "react";
import Container from "../Container";
import { ApiResponse, type FieldForm } from "@/app/lib/type";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Cleave from "cleave.js/react";

type Props = {
  fields: FieldForm[];
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
  showVerifyPhone?: boolean;
  onVerifyPhone?: (phone: string) => void;
};

export default function FormField({
  fields,
  data,
  onChange,
  showVerifyPhone = false,
  onVerifyPhone,
}: Props) {
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, string[]>
  >({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  // fetch options for dynamic select fields
  useEffect(() => {
    fields.forEach(async (field) => {
      if (field.type === "select" && field.fetchUrl) {
        const res: ApiResponse<any> = await axios.get(field.fetchUrl);
        setDynamicOptions((prev) => ({ ...prev, [field.name]: res.data }));
      }
    });
  }, [fields]);

  const handelchange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <Container>
      <div dir="rtl" className="space-y-4 text-right text-black font-sans">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="block mb-1 text-sm">{field.label}</label>

            {field.type === "select" ? (
              field.name === "describtion" ? (
                <select
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={(e) => handelchange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right bg-white"
                  required={field.requierd}
                >
                  <option value="">اختر وصف نشاطك التجاري</option>
                  {(field.options || dynamicOptions[field.name] || []).map(
                    (opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <div className="bg-purple-100 rounded-xl p-2 flex justify-between items-center text-center overflow-hidden">
                  {(field.options || dynamicOptions[field.name] || []).map(
                    (opt, idx, arr) => (
                      <div
                        key={opt}
                        className={`flex-1 py-2 cursor-pointer relative transition
                          ${
                            data[field.name] === opt
                              ? "bg-purple-600 text-white"
                              : "text-purple-800 hover:bg-purple-200"
                          }
                          ${idx === 0 ? "rounded-r-lg" : ""}
                          ${idx === arr.length - 1 ? "rounded-l-lg" : ""}
                          ${
                            idx !== arr.length - 1
                              ? "border-l border-purple-300"
                              : ""
                          }`}
                        onClick={() => handelchange(field.name, opt)}
                      >
                        {opt}
                      </div>
                    )
                  )}
                </div>
              )
            ) : field.type === "password" ? (
              <div className="relative">
                <input
                  name={field.name}
                  type={showPassword[field.name] ? "text" : "password"}
                  value={data[field.name] || ""}
                  onChange={(e) => handelchange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right bg-white"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 hover:text-purple-600"
                >
                  {showPassword[field.name] ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            ) : field.name === "phoneNumber" ? (
              <PhoneInput
                country="sa"
                value={data[field.name] || ""}
                onChange={(value) => handelchange(field.name, value)}
                enableSearch
                preferredCountries={["eg", "sa", "ae"]}
                inputStyle={{
                  width: "100%",
                  padding: "12px",
                  paddingLeft: "42px",
                  borderRadius: "0.75rem",
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                  direction: "ltr",
                  backgroundColor: "#f3f4f6",
                }}
                containerStyle={{ direction: "ltr", width: "100%" }}
                buttonStyle={{
                  border: "none",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.75rem 0 0 0.75rem",
                }}
              />
            ) : field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                onChange={(e) =>
                  handelchange(field.name, e.target.files?.[0] || null)
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            ) : field.placeholder === "1234 5678 9012 3456" ? (
              <Cleave
                options={{ creditCard: true }}
                value={data[field.name] || ""}
                onChange={(e) =>
                  handelchange(field.name, e.target.value.replace(/\s+/g, ""))
                }
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right bg-white"
                inputMode="numeric"
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                value={data[field.name] || ""}
                onChange={(e) => handelchange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-right bg-white"
                required={field.requierd}
                {...(field.inputMode ? { inputMode: field.inputMode } : {})}
              />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
