"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, FileText, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [currentSection, setCurrentSection] = useState<'terms' | 'privacy'>('terms')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const termsText = `
رقم الوثيقة: WIMY-TC-001
تاريخ الإصدار: 2025/05/23
اسم الوثيقة: الشروط والأحكام الخاصة بالبائعين في منصة Wimi Tech

مرحبًا بك في Wimi Tech، شريكك في النجاح!

منصة Wimi Tech هي منصة إلكترونية تهدف إلى تمكين البائعين من عرض وبيع منتجاتهم التقنية بطريقة سهلة وآمنة. يُرجى قراءة هذه الشروط والأحكام بعناية قبل الانضمام كبائع على المنصة. إن تسجيلك في المنصة يُعد موافقة صريحة منك على جميع ما ورد في هذه الوثيقة.

1. الأهلية:
- يجب أن يكون البائع شخصًا طبيعيًا أو اعتباريًا يمتلك سجلًا تجاريًا ساريًا في الدولة التي يعمل بها.
- يجب أن يكون عمر البائع 18 عامًا فأكثر إذا كان شخصًا طبيعيًا.

2. إنشاء الحساب:
- يجب تقديم معلومات صحيحة وكاملة أثناء عملية التسجيل.
- يتحمل البائع مسؤولية الحفاظ على سرية بيانات الدخول الخاصة به.
- يحق لإدارة المنصة رفض أو تعليق أي حساب في حال الاشتباه في نشاط غير قانوني أو مخالف للشروط.

3. المنتجات المسموح بها:
- يُسمح فقط ببيع المنتجات التقنية والإلكترونية مثل (الهواتف، الحواسيب، الإكسسوارات، البرمجيات...إلخ).
- يُمنع بيع أي منتجات محظورة قانونيًا أو لا تتوافق مع سياسات الجودة الخاصة بالمنصة.

4. التزامات البائع:
- الالتزام بتوفير منتجات أصلية وذات جودة عالية.
- توصيل الطلبات في الوقت المحدد دون تأخير.
- تقديم خدمة عملاء ممتازة ومعالجة الشكاوى بجدية.
- تحديث المخزون بشكل دوري لتفادي بيع منتجات غير متوفرة.

5. العمولات والرسوم:
- تفرض Wimi Tech عمولة على كل عملية بيع تتم من خلال المنصة، وتُحدد قيمتها في اتفاقية منفصلة.
- تُخصم العمولة تلقائيًا قبل تحويل أرباح البائع.

6. الدفع والتحويلات:
- تُحول أرباح البائع أسبوعيًا أو شهريًا حسب الاتفاق، إلى الحساب البنكي المسجل.
- يجب أن تكون بيانات الحساب البنكي صحيحة ويعود للبائع أو مؤسسته التجارية.

7. حقوق الملكية الفكرية:
- يضمن البائع أن لديه الحقوق القانونية لبيع المنتجات والعلامات التجارية المعروضة.
- لا تتحمل Wimi Tech مسؤولية أي انتهاك لحقوق الملكية ناتج عن نشاط البائع.

8. المحتوى والبيانات:
- يتحمل البائع مسؤولية المحتوى المعروض (صور، وصف، أسعار).
- تحتفظ Wimi Tech بالحق في تعديل أو حذف أي محتوى مخالف.

9. الإنهاء والتعليق:
- يمكن لأي من الطرفين إنهاء العلاقة بإشعار كتابي.
- يحق لـ Wimi Tech تعليق أو إنهاء حساب البائع في حال خرق الشروط.

10. التعديلات على الشروط:
- تحتفظ Wimi Tech بحق تعديل هذه الشروط في أي وقت، وسيتم إشعار البائعين بالتعديلات عبر البريد الإلكتروني أو إشعار داخل النظام.

11. القانون المعمول به:
- تخضع هذه الاتفاقية لقوانين الدولة التي تأسست بها Wimi Tech.
- تُحل النزاعات من خلال القنوات القانونية أو التحكيم حسب الحالة.

نتطلع لشراكة مثمرة وناجحة معك في Wimi Tech.
  `

  const privacyText = `
سياسة الخصوصية - منصة Wimi Tech

نحن في Wimi Tech نلتزم بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.

1. المعلومات التي نجمعها:
- المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان
- معلومات العمل: السجل التجاري، الوثائق الرسمية
- معلومات الدفع: بيانات الحساب البنكي
- معلومات الاستخدام: تفاعلك مع المنصة

2. كيفية استخدام المعلومات:
- توفير خدمات المنصة
- التواصل معك بخصوص حسابك
- تحسين تجربة المستخدم
- الامتثال للقوانين واللوائح

3. حماية المعلومات:
- تشفير البيانات الحساسة
- تقييد الوصول للمعلومات
- مراجعة دورية لإجراءات الأمان
- تدريب الموظفين على حماية البيانات

4. مشاركة المعلومات:
- لا نبيع معلوماتك لأطراف ثالثة
- نشارك المعلومات فقط عند الضرورة القانونية
- نستخدم مزودي خدمات موثوقين

5. حقوقك:
- الوصول لمعلوماتك
- تصحيح المعلومات غير الدقيقة
- حذف معلوماتك
- الاعتراض على معالجة البيانات

6. تحديثات السياسة:
- نراجع هذه السياسة دوريًا
- نعلمك بأي تغييرات جوهرية
- استمرارك في استخدام المنصة يعني موافقتك على التحديثات

للمزيد من المعلومات، يمكنك التواصل معنا عبر البريد الإلكتروني.
  `

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[98vw] xs:max-w-[95vw] sm:max-w-4xl lg:max-w-5xl transform overflow-hidden rounded-xl xs:rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all mx-1 xs:mx-2">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 sm:p-6 text-white relative">
                  <button
                    onClick={onClose}
                    className="absolute top-2 left-2 sm:top-4 sm:left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="text-center">
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <Dialog.Title className="text-lg sm:text-xl lg:text-2xl font-bold">
                      الشروط والأحكام وسياسة الخصوصية
                    </Dialog.Title>
                    <p className="text-purple-100 mt-1 sm:mt-2 text-xs sm:text-sm">
                      يرجى قراءة هذه الوثائق بعناية قبل المتابعة
                    </p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setCurrentSection('terms')}
                    className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                      currentSection === 'terms'
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">الشروط والأحكام</span>
                      <span className="sm:hidden">الشروط</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentSection('privacy')}
                    className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium transition-colors text-sm sm:text-base ${
                      currentSection === 'privacy'
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">سياسة الخصوصية</span>
                      <span className="sm:hidden">الخصوصية</span>
                    </div>
                  </button>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-6">
                  <div className="max-h-[45vh] xs:max-h-[50vh] sm:max-h-[50vh] overflow-y-auto">
                    {currentSection === 'terms' ? (
                      <div className="prose prose-purple max-w-none text-right">
                        <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-200">
                          <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-gray-700">
                            {termsText}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-purple max-w-none text-right">
                        <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-orange-200">
                          <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-gray-700">
                            {privacyText}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-center">
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg hover:from-purple-700 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 font-medium text-sm sm:text-base"
                  >
                    فهمت
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
