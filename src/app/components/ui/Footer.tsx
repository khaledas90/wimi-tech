"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaEnvelope,
  FaSnapchat,
  FaTiktok,
  FaXTwitter,
  FaLocationDot,
  FaWhatsapp,
} from "react-icons/fa6";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import saudi from "../../../../public/asset/images/المعرض السعودى للاعمال.jpg";
import image1 from "../../../../public/asset/images/1.png";
import image2 from "../../../../public/asset/images/2.jpg";
import image3 from "../../../../public/asset/images/3.png";
import visaIcon from "../../../../public/asset/images/visa.svg";
import mastercardIcon from "../../../../public/asset/images/mastercard.svg";
import applePayIcon from "../../../../public/asset/images/apple-pay.svg";
import tamaraIcon from "../../../../public/asset/images/tamara.png";
import emkanIcon from "../../../../public/asset/images/emkan.png";
import tabbyIcon from "../../../../public/asset/images/tabby.svg";

import { Dialog } from "@headlessui/react";
import TermsModal from "./TermsModal";

const Footer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const openPolicyModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <footer className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white mt-20 rounded-t-3xl shadow-2xl pb-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 px-3">
          {/* Logo & About */}
          <div>
            <Image
              src={Logo}
              alt="Wimi Tech Logo"
              width={150}
              height={75}
              className="mb-4 rounded-full"
              unoptimized
            />
            <p className="text-sm leading-relaxed text-gray-200">
              Wimi Tech: حيث يلتقي التسوق الرفيع بالمرونة اللامتناهية. نحن في
              Wimi Tech نصمم تجربة التجارة الإلكترونية المستقبلية، نقدم لعملائنا
              الكرام عالماً من المنتجات والخدمات الراقية مع خيارات دفع ميسّرة
              وغير مسبوقة، أبرزها حلول التقسيط الذكية.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link
                href="https://www.instagram.com/wimi.sa"
                className="hover:text-pink-400 transition"
                target="_blank"
              >
                <FaInstagram size={18} />
              </Link>
              <Link
                href="https://t.snapchat.com/pQUnE4iA"
                className="hover:text-yellow-400 transition"
                target="_blank"
              >
                <FaSnapchat size={18} />
              </Link>
              <Link
                href="https://www.tiktok.com/@wimi.sa"
                className="hover:text-white transition"
                target="_blank"
              >
                <FaTiktok size={18} />
              </Link>
              <Link
                href="https://x.com/wimi_sa"
                className="hover:text-blue-400 transition"
                target="_blank"
              >
                <FaXTwitter size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2">
              أقسامنا
            </h3>
            <ul className="space-y-2 text-sm text-gray-100">
              <li>الموضة والجمال</li>
              <li>المنزل والمطبخ</li>
              <li>الأطفال والألعاب</li>
              <li>الإلكترونيات والإكسسوارات</li>
              <li>الخدمات الصحية</li>
              <li>الخدمات الغذائية</li>
              <li>الضيافة والسكن</li>
              <li>الصيانة والمقاولات</li>
              <li>السيارات والنقل</li>
              <li>الزراعة</li>
              <li>المراكز التعليمية والتدريبية</li>
              <li>العروض والتخفيضات</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2">
              معرض الصور
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="relative group overflow-hidden rounded-lg transition-all duration-300">
                <Link
                  href="https://maroof.sa/businesses/details/365522?pageType=1&userId=41203506-6e83-40be-8652-3f40f6278125"
                  target="_blank"
                >
                  <Image
                    src={image1}
                    alt="قم المعرف"
                    width={200}
                    height={120}
                    className="w-full h-32 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                </Link>
              </div>
              <div className="relative group overflow-hidden rounded-lg transition-all duration-300">
                <Link href="/saudi">
                  <Image
                    src={image2}
                    alt="ضريبة القيمة المضافة"
                    width={200}
                    height={120}
                    className="w-full h-32 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                </Link>
              </div>
              <div className="relative group overflow-hidden rounded-lg transition-all duration-300">
                <Link
                  href="https://drive.google.com/file/d/1wsazlpuIgdPF3Ij6T8DNDJqHUFqbXpEZ/view"
                  target="_blank"
                >
                  <Image
                    src={image3}
                    alt="شهادة المركز السعودي للأعمال"
                    width={200}
                    height={120}
                    className="w-full h-32 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm text-gray-100">
              <li className="flex items-center gap-2">
                <FaLocationDot /> المقر الرئيسي: السعودية
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="text-green-500" />
                <Link
                  href="https://wa.me/966530574009"
                  target="_blank"
                  className="hover:text-green-400  transition"
                >
                  تواصل معنا الآن على الواتساب
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <FaEnvelope />{" "}
                <a
                  href="mailto:wimi.techsa@gmail.com"
                  className="hover:text-blue-300"
                >
                  wimi.techsa@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2">
              طرق الدفع
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={visaIcon}
                  alt="فيزا"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>فيزا</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={mastercardIcon}
                  alt="ماستر كارد"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>ماستر كارد</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={applePayIcon}
                  alt="آبل باي"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>آبل باي</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={tamaraIcon}
                  alt="تامارا"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>تامارا</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={emkanIcon}
                  alt="امكان"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>امكان</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-100">
                <Image
                  src={tabbyIcon}
                  alt="تابي"
                  width={24}
                  height={16}
                  className="object-contain"
                />
                <span>تابي</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-purple-300 pb-2">
              روابط مهمة
            </h3>
            <ul className="text-sm space-y-2 text-gray-100 text-right">
              <li>
                <button
                  onClick={() =>
                    openPolicyModal(
                      "سياسة الخصوصية",
                      <>
                        <h2>سياسة الخصوصية</h2>

                        <p>
                          نحن في <strong>Wimi Tech</strong> نقدّر ثقتك ونحرص على
                          حماية بياناتك الشخصية. توضح هذه السياسة كيف نجمع،
                          نستخدم، ونحمي معلوماتك.
                        </p>

                        <h3>المعلومات التي نجمعها:</h3>
                        <ul>
                          <li>
                            <strong>معلومات شخصية:</strong> عند التسجيل أو
                            الشراء، قد نجمع اسمك، عنوان بريدك الإلكتروني، رقم
                            هاتفك، عنوان الشحن، ومعلومات الدفع.
                          </li>
                          <li>
                            <strong>معلومات المعاملات:</strong> تفاصيل مشترياتك،
                            تاريخ الشراء، قيمة الطلب، وطريقة الدفع (بما في ذلك
                            معلومات التقسيط).
                          </li>
                          <li>
                            <strong>بيانات الاستخدام:</strong> معلومات حول كيفية
                            تفاعلك مع المنصة، مثل المنتجات التي شاهدتها، الصفحات
                            التي زرتها، وعنوان IP الخاص بك.
                          </li>
                        </ul>

                        <h3>كيف نستخدم معلوماتك:</h3>
                        <ul>
                          <li>
                            لإتمام طلباتك: معالجة مشترياتك، شحن المنتجات، وإدارة
                            مدفوعاتك (بما في ذلك أقساطك).
                          </li>
                          <li>
                            لتحسين تجربتك: تخصيص المحتوى، تقديم توصيات المنتجات،
                            وتحسين وظائف المنصة.
                          </li>
                          <li>
                            للتواصل معك: إرسال تحديثات الطلب، العروض الترويجية
                            (إذا وافقت)، ودعم العملاء.
                          </li>
                          <li>
                            للامتثال القانوني: الالتزام باللوائح والأنظمة
                            المعمول بها في المملكة العربية السعودية.
                          </li>
                        </ul>

                        <h3>كيف نحمي معلوماتك:</h3>
                        <ul>
                          <li>
                            نستخدم تقنيات تشفير قوية لحماية بيانات الدفع
                            والمعلومات الحساسة.
                          </li>
                          <li>
                            نطبق إجراءات أمنية صارمة على خوادمنا وقواعد
                            بياناتنا.
                          </li>
                          <li>
                            نصل إلى معلوماتك فقط عند الضرورة القصوى لأغراض العمل
                            المشروعة.
                          </li>
                        </ul>

                        <h3>مشاركة المعلومات:</h3>
                        <ul>
                          <li>
                            <strong>مع البائعين:</strong> نشارك معلوماتك
                            الضرورية (مثل الاسم، العنوان، رقم الهاتف) مع
                            البائعين لإتمام الشحن والتسليم.
                          </li>
                          <li>
                            <strong>مع مزودي الدفع/التقسيط:</strong> نشارك
                            معلومات الدفع الخاصة بك مع شركائنا الماليين لمعالجة
                            المعاملات وتسهيل خطط التقسيط.
                          </li>
                          <li>
                            <strong>مع شركات الشحن:</strong> نشارك عنوان الشحن
                            ومعلومات الاتصال لتوصيل طلباتك.
                          </li>
                          <li>
                            <strong>جهات خارجية أخرى:</strong> قد نشارك معلومات
                            غير شخصية (مجمعة) لأغراض تحليلية أو تسويقية. لن نبيع
                            معلوماتك الشخصية أو نؤجرها لأي طرف ثالث.
                          </li>
                        </ul>

                        <h3>حقوقك:</h3>
                        <p>
                          يحق لك الوصول إلى بياناتك الشخصية، تصحيحها، أو طلب
                          حذفها (وفقًا للأنظمة المعمول بها).
                        </p>
                      </>
                    )
                  }
                  className="hover:text-gray-300 w-full text-right"
                >
                  سياسة الخصوصية
                </button>
              </li>

              <li>
                <button
                  onClick={() => setTermsModalOpen(true)}
                  className="hover:text-gray-300 w-full text-right"
                >
                  شروط الاستخدام
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    openPolicyModal(
                      "سياسة الإرجاع والاستبدال",
                      <>
                        <h2>سياسة الإرجاع والاستبدال</h2>
                        <p>
                          تسعى Wimi Tech لضمان رضاك التام. إذا لم تكن راضيًا عن
                          مشترياتك، يمكنك الاستفادة من سياسة الإرجاع والاستبدال
                          الخاصة بنا:
                        </p>

                        <h3>فترة الإرجاع</h3>
                        <p>
                          يمكنك طلب إرجاع معظم المنتجات خلال{" "}
                          <strong>[عدد]</strong> يومًا من تاريخ استلام الطلب.
                        </p>

                        <h3>شروط الإرجاع المقبولة:</h3>
                        <ul>
                          <li>
                            يجب أن يكون المنتج في حالته الأصلية، غير مستخدم،
                            وغير تالف.
                          </li>
                          <li>
                            يجب أن تكون جميع الملحقات الأصلية والتغليف وبطاقات
                            المنتج موجودة.
                          </li>
                          <li>
                            بعض المنتجات قد تكون غير قابلة للإرجاع لأسباب صحية
                            أو طبيعة المنتج (مثل المنتجات الرقمية، منتجات
                            العناية الشخصية، أو المنتجات القابلة للتلف). سيتم
                            توضيح ذلك في وصف المنتج.
                          </li>
                        </ul>

                        <h3>عملية الإرجاع:</h3>
                        <ul>
                          <li>
                            يرجى تقديم طلب الإرجاع عبر حسابك في المنصة أو
                            بالتواصل مع فريق خدمة العملاء لدينا.
                          </li>
                          <li>
                            بعد مراجعة الطلب والموافقة عليه، ستتلقى تعليمات حول
                            كيفية إرجاع المنتج (إما عبر شركة شحن أو تسليم
                            مباشر).
                          </li>
                          <li>
                            سيتم فحص المنتج عند وصوله للتأكد من مطابقته للشروط.
                          </li>
                        </ul>

                        <h3>المبالغ المستردة:</h3>
                        <ul>
                          <li>
                            عند الموافقة على الإرجاع، سيتم استرداد المبلغ
                            المدفوع لك بنفس طريقة الدفع الأصلية.
                          </li>
                          <li>
                            في حالة الدفع بالتقسيط، سيتم إلغاء الأقساط المتبقية
                            وتعديل الجدول الزمني للدفع مع مزود خدمة التقسيط.
                          </li>
                          <li>
                            رسوم الشحن: لا تتحمل Wimi Tech أو البائع أي رسوم شحن
                            للإرجاع (في حالة وجود عيب مصنعي أو خطأ من البائع)،
                            أما في حالات الإرجاع الأخرى، فقد تُخصم رسوم الشحن.
                          </li>
                          <li>
                            تتم معالجة المبالغ المستردة عادةً خلال{" "}
                            <strong>[عدد]</strong> أيام عمل من استلام المنتج
                            المرتجع وفحصه.
                          </li>
                        </ul>

                        <h3>الاستبدال:</h3>
                        <p>
                          إذا كنت ترغب في استبدال منتج بآخر، يرجى إرجاع المنتج
                          الأصلي واتباع عملية الإرجاع، ثم إجراء طلب شراء جديد
                          للمنتج الذي ترغب به.
                        </p>
                      </>
                    )
                  }
                  className="hover:text-gray-300 w-full text-right"
                >
                  سياسة الإرجاع والاستبدال
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Important Links Section */}
        <div className="mt-8 border-t border-purple-400 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              الرئيسية
            </Link>
            <Link
              href="/search"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              البحث
            </Link>
            <Link
              href="/favorit"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              المفضلة
            </Link>
            <Link
              href="/view_carts"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              سلة التسوق
            </Link>
            <Link
              href="/auth"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/trade/auth"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              تسجيل التاجر
            </Link>
            <Link
              href="/user_notification"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              الإشعارات
            </Link>
            <Link
              href="/saudi"
              className="text-gray-300 hover:text-white transition text-sm"
            >
              المعرض السعودي
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-purple-400 pt-6 text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة –{" "}
          <span className="font-semibold text-white">Wimi Tech</span>
        </div>
      </footer>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="flex items-center justify-center min-h-screen px-4 relative">
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            aria-hidden="true"
          />
          <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-3xl w-full z-10 text-gray-800 shadow-xl text-right">
            <Dialog.Title className="text-xl font-bold mb-4 border-b pb-2">
              {modalTitle}
            </Dialog.Title>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto text-sm leading-relaxed">
              {modalContent}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                إغلاق
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
};

export default Footer;
