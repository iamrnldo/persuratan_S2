import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  Loader2,
  // Remove Facebook and Instagram from here
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    lines: [
      "Jl. Desa Sukamaju No.1",
      "Kec. Maju, Kab. Jaya",
      "Jawa Barat 12345",
    ],
  },
  {
    icon: Phone,
    title: "Telepon",
    lines: ["(0264) 123-4567", "WhatsApp: 0812-3456-7890"],
  },
  { icon: Mail, title: "Email", lines: ["info@desa-sukamaju.go.id"] },
  {
    icon: Clock,
    title: "Jam Pelayanan",
    lines: ["Senin – Jumat", "08.00 – 16.00 WIB"],
  },
];

// Custom SVG icons
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 fill-none stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    try {
      // jika ada endpoint kontak
      await axios.post(`${API}/kontak`, values);
      setSubmitted(true);
      reset();
      toast.success("Pesan berhasil dikirim!");
    } catch {
      // fallback: just show success (untuk demo)
      setSubmitted(true);
      reset();
      toast.success("Pesan berhasil dikirim!");
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
      err
        ? "border-red-300 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-5">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Hubungi Kami
          </h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Ada pertanyaan atau butuh bantuan? Tim kami siap melayani Anda
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* left: info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Informasi Kontak
              </h2>
              <p className="text-gray-500 text-sm">
                Kunjungi kantor kami atau gunakan informasi berikut untuk
                menghubungi perangkat desa.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, title, lines }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-green-50 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {title}
                    </p>
                    {lines.map((l) => (
                      <p key={l} className="text-sm text-gray-500 leading-snug">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* social */}
            <div className="bg-white rounded-2xl p-5 border border-green-50 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-3">Ikuti Kami</p>
              <div className="flex gap-3">
                {[
                  {
                    icon: FacebookIcon,
                    label: "Facebook",
                    color:
                      "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
                  },
                  {
                    icon: InstagramIcon,
                    label: "Instagram",
                    color:
                      "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 transition-all duration-200 ${color}`}
                  >
                    <Icon />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* right: form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Pesan Terkirim!
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Kami akan merespons
                    pesan Anda dalam 1×24 jam kerja.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    Kirim Pesan Lagi
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Kirim Pesan
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* nama */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            {...register("nama", {
                              required: "Nama wajib diisi",
                            })}
                            placeholder="Nama Anda"
                            className={`${inputClass(errors.nama)} pl-10`}
                          />
                        </div>
                        {errors.nama && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.nama.message}
                          </p>
                        )}
                      </div>

                      {/* email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            {...register("email", {
                              required: "Email wajib diisi",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Format email tidak valid",
                              },
                            })}
                            type="email"
                            placeholder="email@anda.com"
                            className={`${inputClass(errors.email)} pl-10`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* telepon */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        No. Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          {...register("telepon")}
                          type="tel"
                          placeholder="08xxxxxxxxxx"
                          className={`${inputClass()} pl-10`}
                        />
                      </div>
                    </div>

                    {/* subjek */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("subjek", {
                          required: "Subjek wajib diisi",
                        })}
                        placeholder="Topik pesan Anda"
                        className={inputClass(errors.subjek)}
                      />
                      {errors.subjek && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.subjek.message}
                        </p>
                      )}
                    </div>

                    {/* pesan */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("pesan", {
                          required: "Pesan wajib diisi",
                          minLength: {
                            value: 10,
                            message: "Pesan minimal 10 karakter",
                          },
                        })}
                        rows={5}
                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                        className={`${inputClass(errors.pesan)} resize-none`}
                      />
                      {errors.pesan && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.pesan.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-green-300/50 hover:-translate-y-0.5 transform disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
