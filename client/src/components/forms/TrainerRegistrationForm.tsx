import React from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react"; // آیکن ضربدر برای بستن
import { useTrainer } from "@/context/TrainerContext"; // hook context
// A clean, readable Trainer Registration form in TSX using TailwindCSS + react-hook-form
// Usage: import TrainerRegistrationForm from './TrainerRegistrationForm';
// Dependencies: react, react-dom, react-hook-form, tailwindcss (optional)

type FormValues = {
  id: string;
  name: string;
  lastName: string;
  parentType: "ولد" | "بنت" | string; // allow free text for flexibility
  parentName: string;
  gender: "مرد" | "زن" | string;
  province: string;
  department: string;
  specialty: string;
  hospital: string;
  joiningDate: string; // YYYY-MM-DD
  trainingYear: string;
  supervisorName: string;
  birthDate: string; // YYYY-MM-DD
  idNumber: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  postNumberAndCode: string;
  appointmentType: "رقابت آزاد" | "داوطلب" | "حکمی" | "بست خالی" | string;
  status: "برحال" | "خدماتی" | string;
};

type TrainerRegistrationFormProps = {
  onClose: () => void;
};

export default function TrainerRegistrationForm({
  onClose,
}: TrainerRegistrationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: "",
      name: "",
      lastName: "",
      parentType: "",
      parentName: "",
      gender: "",
      province: "",
      department: "",
      specialty: "",
      hospital: "",
      joiningDate: "",
      trainingYear: "",
      supervisorName: "",
      birthDate: "",
      idNumber: "",
      phoneNumber: "",
      whatsappNumber: "",
      email: "",
      postNumberAndCode: "",
      appointmentType: "",
      status: "",
    },
  });
  const { setTrainerId } = useTrainer(); // دسترسی به setter context

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("خطا در ثبت فرم: " + (errorData.message || "اطلاعات نادرست"));
        return;
      }

      const savedTrainer = await response.json();
      console.log("Saved trainer:", savedTrainer); // 🔴 اینو اضافه کن

      // 👇 مطمئن شو فیلد درست را می‌گیری
      const trainerId = savedTrainer?._id ?? savedTrainer?.id;

      if (!trainerId) {
        alert("API آیدی برنگرداند!");
        return;
      }

      setTrainerId(trainerId);
      alert("ترینر با موفقیت ثبت شد!");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت فرم، دوباره تلاش کنید.");
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md relative">
        {/* دکمه بستن */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h1 className="text-2xl font-semibold mb-4 text-center">
          فورم ثبت نام ترینری
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm">ایدی</span>
              <input
                {...register("id", { required: "ایدی لازم است" })}
                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2"
                placeholder="ایدی را وارد کنید."
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-sm">اسم</span>
              <input
                {...register("name", { required: "اسم لازم است" })}
                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2"
                placeholder="اسم را وارد کنید."
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm">تخلص</span>
              <input
                {...register("lastName", { required: "اسم لازم است" })}
                className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2"
                placeholder="تخلص را وارد کنید."
              />
              {errors.lastName && (
                <span className="text-red-600 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm">ولد/بنت</span>
              <input
                {...register("parentType")}
                className="mt-1 p-2 border rounded-md"
                placeholder="نام پدر را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">ولدیت</span>
              <input
                {...register("parentName")}
                className="mt-1 p-2 border rounded-md"
                placeholder="نام پدر بزرگ را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">جنسیت</span>
              <select
                {...register("gender")}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">جنسیت را انتخاب کنید.</option>
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm">ولایت</span>
              <select
                {...register("province", { required: "انتخاب ولایت لازم است" })}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">ولایت را انتخاب کنید.</option>
                <option value="کابل">کابل</option>
                <option value="پروان">پروان</option>
                <option value="کاپیسا">کاپیسا</option>
                <option value="پنجشیر">پنجشیر</option>
                <option value="میدان وردک">میدان وردک</option>
                <option value="لوگر">لوگر</option>
                <option value="غزنی">غزنی</option>
                <option value="پکتیا">پکتیا</option>
                <option value="پکتیکا">پکتیکا</option>
                <option value="خوست">خوست</option>
                <option value="ننگرهار">ننگرهار</option>
                <option value="لغمان">لغمان</option>
                <option value="کنر">کنر</option>
                <option value="نورستان">نورستان</option>
                <option value="بغلان">بغلان</option>
                <option value="کندز">کندز</option>
                <option value="تخار">تخار</option>
                <option value="بدخشان">بدخشان</option>
                <option value="سمنگان">سمنگان</option>
                <option value="بلخ">بلخ</option>
                <option value="جوزجان">جوزجان</option>
                <option value="فاریاب">فاریاب</option>
                <option value="سرپل">سرپل</option>
                <option value="بامیان">بامیان</option>
                <option value="دایکندی">دایکندی</option>
                <option value="هرات">هرات</option>
                <option value="بادغیس">بادغیس</option>
                <option value="فراه">فراه</option>
                <option value="نیمروز">نیمروز</option>
                <option value="هلمند">هلمند</option>
                <option value="قندهار">قندهار</option>
                <option value="زابل">زابل</option>
                <option value="ارزگان">ارزگان</option>
                <option value="غور">غور</option>
              </select>
              {errors.province && (
                <span className="text-red-600 text-sm">
                  {errors.province.message}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm">دیپارتمنت</span>
              <select
                {...register("department", { required: "دیپارتمنت لازم است" })}
                className="mt-1 p-2 border rounded-md"
              >
                <option value=""> دیپارتمنت را انتخاب کنید.</option>
                <option value="شبکیه">شبکیه</option>
                <option value="اطفال">اطفال</option>
                <option value="چشم پولیس">چشم پولیس</option>
                <option value="جراحی پلاستیک">جراحی پلاستیک</option>
                <option value="قرنیه">قرنیه</option>
                <option value="گلوکوم">گلوکوم</option>
                <option value="دیدکم">دیدکم</option>
                <option value="پبپکم">پبپکم</option>
                <option value="عمومی">عمومی</option>
              </select>
              {errors.department && (
                <span className="text-red-600 text-sm">
                  {errors.department.message}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm">رشته تخصصی</span>
              <select
                {...register("specialty", { required: "رشته تخصصی لازم است" })}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">رشته تخصص را انتخاب کنید.</option>
                <option value="چشم">چشم</option>
                {/* در آینده می‌توانید گزینه‌های دیگر اضافه کنید */}
              </select>
              {errors.specialty && (
                <span className="text-red-600 text-sm">
                  {errors.specialty.message}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm">شفاخانه</span>
              <input
                {...register("hospital")}
                className="mt-1 p-2 border rounded-md"
                placeholder="نام شفاخانه را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">تاریخ شمولیت به پروگرام تریننگ</span>
              <input
                type="date"
                {...register("joiningDate")}
                className="mt-1 p-2 border rounded-md"
                placeholder="تاریخ را انتخاب کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">سال تریننگ فعلی (صنف)</span>
              <input
                {...register("trainingYear")}
                className="mt-1 p-2 border rounded-md"
                placeholder="سال تریننگ را را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">اسم سوپروایزر (ترینر)</span>
              <input
                {...register("supervisorName")}
                className="mt-1 p-2 border rounded-md"
                placeholder="اسم سوپروایزر را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">تاریخ تولد</span>
              <input
                type="date"
                {...register("birthDate")}
                className="mt-1 p-2 border rounded-md"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">نمبر تذکره</span>
              <input
                {...register("idNumber")}
                className="mt-1 p-2 border rounded-md"
                placeholder="نمبر تذکره را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">شماره تماس</span>
              <input
                {...register("phoneNumber")}
                className="mt-1 p-2 border rounded-md"
                placeholder="شماره تماس را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">شماره واتسپ</span>
              <input
                {...register("whatsappNumber")}
                className="mt-1 p-2 border rounded-md"
                placeholder="شماره واتسپ را وارد کنید."
              />
            </label>

            <label className="flex flex-col ">
              <span className="text-sm">ایمل آدرس</span>
              <input
                type="email"
                {...register("email")}
                className="mt-1 p-2 border rounded-md"
                placeholder="ایمل آدرس را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">شماره و کود بست</span>
              <input
                {...register("postNumberAndCode")}
                className="mt-1 p-2 border rounded-md"
                placeholder="شماره و کود بست را وارد کنید."
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">نوع تقرر</span>
              <select
                {...register("appointmentType")}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">نوع تقرر را انتخاب کنید.</option>
                <option value="رقابت آزاد">رقابت آزاد</option>
                <option value="داوطلب">داوطلب</option>
                <option value="حکمی">حکمی</option>
                <option value="بست خالی">بست خالی</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm">وضعیت فعلی</span>
              <select
                {...register("status")}
                className="mt-1 p-2 border rounded-md"
              >
                <option value="">وضعیت فعلی را انتخاب کنید</option>
                <option value="برحال">برحال</option>
                <option value="خدماتی">خدماتی</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              لغو
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ثبت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
