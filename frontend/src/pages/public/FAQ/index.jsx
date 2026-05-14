/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/refs */
import { useEffect, useState, useRef } from "react";
import { ChevronDown, Search, HelpCircle, MessageCircle } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? "border-green-300 shadow-md shadow-green-100/50"
          : "border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md"
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <div className="flex items-start gap-4">
          <span
            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
              open
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 group-hover:bg-green-200"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-semibold text-sm leading-snug transition-colors duration-200 ${
              open
                ? "text-green-700"
                : "text-gray-900 group-hover:text-green-700"
            }`}
          >
            {item.pertanyaan || item.question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-green-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight || 500}px`
            : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-6 pb-5 ml-11">
          <div className="w-full h-px bg-green-100 mb-4" />
          <p className="text-gray-600 text-sm leading-relaxed">
            {item.jawaban || item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

const fallbackFAQ = [
  {
    pertanyaan: "Bagaimana cara mengajukan surat keterangan?",
    jawaban:
      "Warga dapat mengajukan surat keterangan dengan mengunjungi kantor desa pada jam kerja (Senin–Jumat, 08.00–16.00 WIB) dan membawa dokumen persyaratan yang diperlukan.",
  },
  {
    pertanyaan: "Berapa lama proses pembuatan surat?",
    jawaban:
      "Proses pembuatan surat umumnya membutuhkan waktu 1×24 jam kerja setelah dokumen persyaratan dinyatakan lengkap.",
  },
  {
    pertanyaan: "Apakah ada biaya untuk pengurusan surat?",
    jawaban:
      "Semua layanan surat di Desa Sukamaju tidak dikenakan biaya (gratis). Jika ada pihak yang meminta biaya, harap laporkan kepada kepala desa.",
  },
  {
    pertanyaan: "Bagaimana cara mengecek status surat saya?",
    jawaban:
      "Anda dapat mengecek status surat melalui fitur 'Cek Surat' di website ini dengan memasukkan nomor surat yang tertera pada tanda terima pengajuan.",
  },
  {
    pertanyaan: "Apa saja dokumen yang perlu disiapkan?",
    jawaban:
      "Secara umum, Anda perlu menyiapkan fotokopi KTP, fotokopi KK, surat pengantar dari RT/RW, dan dokumen pendukung sesuai jenis surat yang diajukan.",
  },
  {
    pertanyaan: "Bisakah surat diambil oleh orang lain?",
    jawaban:
      "Ya, surat dapat diambil oleh orang lain dengan membawa surat kuasa bermaterai dan fotokopi KTP pemberi serta penerima kuasa.",
  },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");

  useEffect(() => {
    axios
      .get(`${API}/faq`)
      .then(({ data }) => setFaqs(data.data || data || fallbackFAQ))
      .catch(() => setFaqs(fallbackFAQ))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter(
    (f) =>
      (f.pertanyaan || f.question)
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      (f.jawaban || f.answer)?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-white/5 rounded-full"
              style={{
                left: `${20 + i * 25}%`,
                top: i % 2 === 0 ? "-30%" : "60%",
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-5">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Pertanyaan Umum
          </h1>
          <p className="text-green-100 text-lg mb-8">
            Temukan jawaban atas pertanyaan yang sering diajukan warga
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pertanyaan..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada FAQ"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Menampilkan{" "}
              <span className="font-semibold text-green-600">
                {filtered.length}
              </span>{" "}
              pertanyaan
              {search && ` untuk "${search}"`}
            </p>
            <div className="space-y-4">
              {filtered.map((faq, i) => (
                <FAQItem key={faq.id || i} item={faq} index={i} />
              ))}
            </div>
          </>
        )}

        {/* still have questions */}
        <div className="mt-14 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
          </div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2">Masih Punya Pertanyaan?</h3>
            <p className="text-green-100 text-sm mb-6 max-w-sm mx-auto">
              Tim kami siap membantu Anda. Jangan ragu untuk menghubungi kami
              langsung.
            </p>
            <Link
              to="/kontak"
              className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
