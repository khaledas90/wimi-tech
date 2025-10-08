"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"customers" | "traders">(
    "customers"
  );

  const customerTerms = (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">
        شروط الاستخدام للعملاء
      </h2>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          باستخدامك لمنصة <strong>Wimi Tech</strong> كعميل، فإنك توافق على
          الالتزام بالشروط والأحكام التالية:
        </p>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            1. سياسة الخصوصية
          </h3>
          <p>
            نحن في <strong>Wimi Tech</strong> نقدّر ثقتك ونحرص على حماية بياناتك
            الشخصية. هذه السياسة توضح كيف نجمع، نستخدم، ونحمي معلوماتك.
          </p>

          <h4 className="font-semibold text-base">المعلومات التي نجمعها:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>معلومات شخصية:</strong> عند التسجيل أو الشراء، قد نجمع
              اسمك، عنوان بريدك الإلكتروني، رقم هاتفك، عنوان الشحن، ومعلومات
              الدفع.
            </li>
            <li>
              <strong>معلومات المعاملات:</strong> تفاصيل مشترياتك، تاريخ الشراء،
              قيمة الطلب، وطريقة الدفع (بما في ذلك معلومات التقسيط).
            </li>
            <li>
              <strong>بيانات الاستخدام:</strong> معلومات حول كيفية تفاعلك مع
              المنصة، مثل المنتجات التي شاهدتها، الصفحات التي زرتها، وعنوان IP
              الخاص بك.
            </li>
          </ul>

          <h4 className="font-semibold text-base">كيف نستخدم معلوماتك:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              لإتمام طلباتك: معالجة مشترياتك، شحن المنتجات، وإدارة مدفوعاتك (بما
              في ذلك أقساطك).
            </li>
            <li>
              لتحسين تجربتك: تخصيص المحتوى، تقديم توصيات المنتجات، وتحسين وظائف
              المنصة.
            </li>
            <li>
              للتواصل معك: إرسال تحديثات الطلب، العروض الترويجية (إذا وافقت)،
              ودعم العملاء.
            </li>
            <li>
              للامتثال القانوني: الالتزام باللوائح والأنظمة المعمول بها في
              المملكة العربية السعودية.
            </li>
          </ul>

          <h4 className="font-semibold text-base">حقوقك:</h4>
          <p>
            يحق لك الوصول إلى بياناتك الشخصية، تصحيحها، أو طلب حذفها (وفقًا
            للأنظمة المعمول بها).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            2. سياسة الإرجاع والاستبدال
          </h3>
          <p>
            نسعى في <strong>Wimi Tech</strong> لضمان رضاك التام. إذا لم تكن
            راضيًا عن مشترياتك، يمكنك الاستفادة من سياسة الإرجاع والاستبدال
            الخاصة بنا.
          </p>

          <h4 className="font-semibold text-base">فترة الإرجاع:</h4>
          <p>
            يمكنك طلب إرجاع معظم المنتجات خلال <strong>7</strong> أيام من تاريخ
            استلام الطلب.
          </p>

          <h4 className="font-semibold text-base">شروط الإرجاع المقبولة:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، وغير تالف.</li>
            <li>
              يجب أن تكون جميع الملحقات الأصلية والتغليف وبطاقات المنتج موجودة.
            </li>
            <li>
              بعض المنتجات قد تكون غير قابلة للإرجاع لأسباب صحية أو طبيعة
              المنتج.
            </li>
          </ul>

          <h4 className="font-semibold text-base">المبالغ المستردة:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              عند الموافقة على الإرجاع، سيتم استرداد المبلغ المدفوع لك بنفس
              طريقة الدفع الأصلية.
            </li>
            <li>
              في حالة الدفع بالتقسيط، سيتم إلغاء الأقساط المتبقية وتعديل الجدول
              الزمني للدفع.
            </li>
            <li>
              تتم معالجة المبالغ المستردة عادةً خلال <strong>5-7</strong> أيام
              عمل من استلام المنتج المرتجع.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            3. شروط استخدام المنصة
          </h3>

          <h4 className="font-semibold text-base">أهليتك للاستخدام:</h4>
          <p>
            يجب أن تكون في السن القانوني (18 عامًا فما فوق) ولديك الأهلية
            القانونية لإبرام العقود.
          </p>

          <h4 className="font-semibold text-base">إنشاء الحساب:</h4>
          <p>
            أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور، وعن جميع
            الأنشطة التي تتم تحت حسابك.
          </p>

          <h4 className="font-semibold text-base">الاستخدام المقبول:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              يجب استخدام المنصة لأغراض مشروعة فقط ووفقًا للأنظمة المعمول بها في
              المملكة العربية السعودية.
            </li>
            <li>يُمنع أي استخدام احتيالي، مسيء، أو غير قانوني للمنصة.</li>
            <li>
              يُمنع محاولة الوصول غير المصرح به إلى أنظمتنا أو بيانات المستخدمين
              الآخرين.
            </li>
          </ul>

          <h4 className="font-semibold text-base">المشتريات والمدفوعات:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              عند إجراء عملية شراء، فإنك توافق على دفع السعر المعلن للمنتج أو
              الخدمة، بالإضافة إلى أي رسوم شحن أو ضرائب مطبقة.
            </li>
            <li>
              أنت توافق على الالتزام بشروط وأحكام مزود خدمة الدفع/التقسيط الذي
              تختاره.
            </li>
          </ul>

          <h4 className="font-semibold text-base">حدود المسؤولية:</h4>
          <p>
            لا تضمن <strong>Wimi Tech</strong> أن تكون المنصة خالية من الأخطاء
            أو الانقطاعات. نحن نسعى لتقديم أفضل خدمة ممكنة، ولكننا لا نتحمل
            المسؤولية عن أي أضرار غير مباشرة ناتجة عن استخدام المنصة.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            4. التواصل معنا
          </h3>
          <p>
            نحن هنا لمساعدتك! إذا كان لديك أي أسئلة، استفسارات، أو تحتاج إلى
            دعم، فلا تتردد في التواصل معنا عبر:
          </p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>رقم التواصل الموحد:</strong> 0530574009
            </li>
            <li>
              <strong>البريد الإلكتروني للدعم:</strong> wimi.techsa@gmail.com
            </li>
            <li>
              <strong>نماذج التواصل:</strong> المتوفرة على المنصة
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            5. القانون الحاكم
          </h3>
          <p>تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة العربية السعودية.</p>
        </div>
      </div>
    </>
  );

  const traderTerms = (
    <>
      <h2 className="text-xl font-bold mb-4 text-center">
        شروط الاستخدام للتجار
      </h2>

      <div className="space-y-6 text-sm leading-relaxed">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-center mb-2">
            الشروط والأحكام الخاصة بالبائعين في منصة Wimi Tech
          </p>
          <p className="text-center text-gray-600">
            رقم الوثيقة: WIMY-TC-001 | تاريخ الإصدار: 2025/05/23
          </p>
        </div>

        <p>
          مرحبًا بك في <strong>Wimi Tech</strong>، شريكك في النجاح! منصتنا صُممت
          خصيصًا لتمكينك من عرض منتجاتك أو خدماتك وإرسال روابط دفع سلسة لعملائك،
          مع توفير خيارات دفع مرنة (بما فيها التقسيط) لزيادة مبيعاتك.
        </p>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (1): تعريفات أساسية
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>المنصة:</strong> هي "Wimi Tech"، منصتنا الإلكترونية الذكية
              التي تسهل عمليات البيع والدفع بينك وبين عملائك.
            </li>
            <li>
              <strong>البائع:</strong> أنت، سواء كنت فردًا أو شركة، تستخدم
              منصتنا لعرض وبيع منتجاتك أو خدماتك.
            </li>
            <li>
              <strong>العميل:</strong> هو المشتري النهائي الذي يستفيد من منتجاتك
              أو خدماتك عن طريق الدفع عبر المنصة.
            </li>
            <li>
              <strong>رابط الدفع:</strong> رابط إلكتروني فريد تنشئه أنت عبر
              المنصة، ويحتوي على تفاصيل منتجك أو خدمتك.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (2): كيف نعمل معًا
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              تعمل Wimi Tech كوسيط تقني متكامل بينك وبين عملائك، ولا نُعد بأي
              حال من الأحوال جهة تمويلية أو بنكًا.
            </li>
            <li>
              لتقديم خدمة التقسيط بسلاسة، تعمل Wimi Tech بآلية تقوم من خلالها
              بشراء المنتجات منك كبائع (بشكل آجل).
            </li>
            <li>
              كشريك، تظل مسؤولية جودة المنتج أو الخدمة المعروضة والمشحونة على
              عاتقك أنت كبائع.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (3): خدمات Wimi Tech لك
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>عرض منتجاتك وخدماتك مباشرة داخل واجهة المنصة</li>
            <li>
              إنشاء روابط دفع مباشرة وفريدة يمكنك مشاركتها بسهولة مع عملائك
            </li>
            <li>
              تحصيل المدفوعات من العملاء، سواء كانت دفعات فورية أو بالتقسيط
            </li>
            <li>التكامل السلس مع مزودي التقسيط المرخصين</li>
            <li>إدارة عمليات الشحن لمنتجاتك</li>
            <li>لوحة تحكم متكاملة وتقارير مفصلة لمتابعة مبيعاتك</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (4): التزاماتك
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>دقة البيانات:</strong> تقديم معلومات دقيقة وصحيحة ومفصلة
              عن جميع المنتجات أو الخدمات التي تعرضها.
            </li>
            <li>
              <strong>جودة المنتج:</strong> ضمان جودة وصلاحية المنتج أو الخدمة،
              ومطابقتها للمواصفات المعلن عنها.
            </li>
            <li>
              <strong>عدم فرض رسوم إضافية:</strong> الالتزام بعدم فرض أي رسوم
              إضافية على العميل تتعلق بخيار التقسيط.
            </li>
            <li>
              <strong>إدارة الإرجاع:</strong> رفع طلب الإرجاع عبر لوحة التحكم في
              المنصة خلال 48 ساعة من تاريخ استلام طلب الإرجاع من العميل.
            </li>
          </ul>

          <h4 className="font-semibold text-base">ممارسات ممنوعة:</h4>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>رد المبلغ نقدًا (كاش) للعميل بأي شكل من الأشكال</li>
            <li>
              إعادة شراء المنتج من العميل بعد إتمام عملية البيع عبر المنصة
            </li>
            <li>
              إجراء أي تسوية مالية أو استرجاع للمنتج خارج نظام ومنصة Wimi Tech
            </li>
            <li>استخدام روابط دفع وهمية أو غير حقيقية أو لأغراض غير مشروعة</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (5): التزامنا بالضوابط الشرعية
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              عدم رد القيمة نقدًا: يُمنع منعًا باتًا رد قيمة المنتج المباع نقدًا
              (كاش) بعد إتمام عملية البيع.
            </li>
            <li>
              عدم الشراء من العميل: يُمنع عليك كبائع شراء المنتج من العميل أو
              استلام أي مبالغ مالية منه مقابل المنتج بعد البيع.
            </li>
            <li>
              عمليات الإرجاع الشرعية: تتم جميع عمليات الإرجاع حصريًا عبر المنصة.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (6): أمورك المالية والتحصيل
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>خدمات مجانية:</strong> تُقدم Wimi Tech خدماتها بشكل مجاني
              تمامًا للبائعين، بدون أي رسوم اشتراك أو استخدام.
            </li>
            <li>
              <strong>تحويل المستحقات:</strong> نعمل على تحويل مستحقاتك المالية
              بسرعة وكفاءة، خلال 7 أيام عمل كحد أقصى.
            </li>
            <li>
              <strong>رسوم الإرجاع:</strong> تتحمل Wimi Tech جميع رسوم الإرجاع
              المتعلقة بالمنتجات.
            </li>
            <li>
              <strong>الآيبان البنكي:</strong> يجب أن يكون الآيبان البنكي
              مملوكًا لنفس كيانك التجاري أو مطابقًا لهويتك المسجلة في المنصة.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (7): مدة شراكتنا وإنهائها
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>مدة الاتفاقية:</strong> تبدأ شراكتنا من تاريخ موافقتك
              الإلكترونية وتستمر لمدة 12 شهرًا ميلاديًا، وهي قابلة للتجديد
              تلقائيًا.
            </li>
            <li>
              <strong>الإنهاء بإشعار:</strong> يحق لأي من الطرفين إنهاء هذه
              الاتفاقية بإشعار كتابي مسبق قبل 15 يومًا.
            </li>
            <li>
              <strong>الإنهاء الفوري:</strong> يحق لـ Wimi Tech إنهاء هذه
              الاتفاقية فوريًا في حال المخالفة.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (8): القانون المطبق وحل النزاعات
          </h3>
          <p>
            تخضع هذه الاتفاقية في تفسيرها وتنفيذها للأنظمة والقوانين المعمول بها
            في المملكة العربية السعودية.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-purple-600">
            المادة (9): التواصل الرسمي
          </h3>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>
              <strong>أرقام التواصل الرسمية:</strong> 0534328197 | 0530574009
            </li>
            <li>
              <strong>البريد الإلكتروني الرسمي:</strong> wimi.techsa@gmail.com
            </li>
            <li>
              أي تواصل من خلال رقم آخر غير المذكور أعلاه لا يعتبر تواصلًا رسميًا
              أو معتمدًا من قبل المنصة.
            </li>
          </ul>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4 relative">
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          aria-hidden="true"
        />

        <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-4xl w-full z-10 text-gray-800 shadow-xl">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === "customers"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              للعملاء
            </button>
            <button
              onClick={() => setActiveTab("traders")}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === "traders"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              للتجار
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto text-right">
            {activeTab === "customers" ? customerTerms : traderTerms}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              إغلاق
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TermsModal;
