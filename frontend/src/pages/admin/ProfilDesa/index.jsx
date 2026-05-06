/* eslint-disable react-hooks/set-state-in-effect */
// frontend/src/pages/admin/ProfilDesa/index.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import { profilDesaService } from "../../../api/profilDesaService";
import { PageHeader } from "../../../components/admin/PageHeader";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Textarea } from "../../../components/common/Textarea";

// Section wrapper untuk grouping field
const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
    <h2 className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">{children}</div>
  </div>
);

const FullCol = ({ children }) => (
  <div className="sm:col-span-2">{children}</div>
);

const ProfilDesaPage = () => {
  const [profilId, setProfilId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchProfil = async () => {
    try {
      setLoadingData(true);
      const response = await profilDesaService.get();
      const data = response.data;
      setProfilId(data.id);
      reset(data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Gagal memuat data profil desa");
      }
      // 404 = belum ada data, form tetap kosong untuk insert pertama
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchProfil();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(data)
          // Hapus field yang tidak boleh diupdate
          .filter(([k]) => !["id", "created_at", "updated_at"].includes(k))
          .map(([k, v]) => {
            if (v === "" || v === null || v === undefined) return [k, null];

            const intFields = [
              "jumlah_penduduk",
              "jumlah_kk",
              "jumlah_dusun",
              "jumlah_rw",
            ];
            const floatFields = ["luas_wilayah"];

            if (intFields.includes(k)) return [k, parseInt(v) || null];
            if (floatFields.includes(k)) return [k, parseFloat(v) || null];

            return [k, v];
          }),
      );

      if (profilId) {
        await profilDesaService.update(profilId, payload);
      } else {
        await profilDesaService.upsert(payload);
      }
      toast.success("Profil desa berhasil disimpan");
      fetchProfil();
    } catch (error) {
      console.error("Full error:", error.response?.data);
      const message = error.response?.data?.message || "Terjadi kesalahan";
      toast.error(message);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profil Desa"
        subtitle="Informasi umum dan identitas desa"
        actions={
          <Button
            variant="primary"
            icon={Save}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Simpan Perubahan
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Identitas Desa */}
        <Section title="Identitas Desa">
          <FullCol>
            <Input
              label="Nama Desa"
              required
              error={errors.nama_desa?.message}
              placeholder="Contoh: Desa Sumber Makmur"
              {...register("nama_desa", {
                required: "Nama desa wajib diisi",
                maxLength: { value: 100, message: "Maksimal 100 karakter" },
              })}
            />
          </FullCol>
          <Input
            label="Kecamatan"
            error={errors.kecamatan?.message}
            placeholder="Nama kecamatan"
            {...register("kecamatan", {
              maxLength: { value: 100, message: "Maksimal 100 karakter" },
            })}
          />
          <Input
            label="Kabupaten"
            error={errors.kabupaten?.message}
            placeholder="Nama kabupaten"
            {...register("kabupaten", {
              maxLength: { value: 100, message: "Maksimal 100 karakter" },
            })}
          />
          <Input
            label="Provinsi"
            error={errors.provinsi?.message}
            placeholder="Nama provinsi"
            {...register("provinsi", {
              maxLength: { value: 100, message: "Maksimal 100 karakter" },
            })}
          />
          <Input
            label="Kode Pos"
            error={errors.kode_pos?.message}
            placeholder="Contoh: 61254"
            {...register("kode_pos", {
              maxLength: { value: 10, message: "Maksimal 10 karakter" },
            })}
          />
          <FullCol>
            <Textarea
              label="Alamat Lengkap"
              rows={2}
              error={errors.alamat?.message}
              placeholder="Jl. Raya Desa No. 1"
              {...register("alamat")}
            />
          </FullCol>
        </Section>

        {/* Kontak */}
        <Section title="Kontak">
          <Input
            label="No. Telepon"
            error={errors.no_telp?.message}
            placeholder="Contoh: 031-1234567"
            {...register("no_telp", {
              maxLength: { value: 20, message: "Maksimal 20 karakter" },
            })}
          />
          <Input
            label="WhatsApp"
            error={errors.whatsapp?.message}
            placeholder="Contoh: 081234567890"
            {...register("whatsapp", {
              maxLength: { value: 20, message: "Maksimal 20 karakter" },
            })}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            placeholder="email@desa.go.id"
            {...register("email", {
              maxLength: { value: 100, message: "Maksimal 100 karakter" },
            })}
          />
          <Input
            label="Website"
            error={errors.website?.message}
            placeholder="https://desa.go.id"
            {...register("website")}
          />
        </Section>

        {/* Media Sosial */}
        <Section title="Media Sosial">
          <Input
            label="Facebook"
            error={errors.facebook?.message}
            placeholder="URL Facebook"
            {...register("facebook")}
          />
          <Input
            label="Instagram"
            error={errors.instagram?.message}
            placeholder="URL Instagram"
            {...register("instagram")}
          />
          <Input
            label="YouTube"
            error={errors.youtube?.message}
            placeholder="URL YouTube"
            {...register("youtube")}
          />
        </Section>

        {/* Data Wilayah */}
        <Section title="Data Wilayah & Kependudukan">
          <Input
            label="Luas Wilayah (Ha)"
            type="number"
            step="0.01"
            error={errors.luas_wilayah?.message}
            placeholder="Contoh: 125.50"
            {...register("luas_wilayah")}
          />
          <Input
            label="Jumlah Penduduk"
            type="number"
            error={errors.jumlah_penduduk?.message}
            placeholder="Contoh: 3500"
            {...register("jumlah_penduduk", {
              min: { value: 0, message: "Harus angka positif" },
            })}
          />
          <Input
            label="Jumlah KK"
            type="number"
            error={errors.jumlah_kk?.message}
            placeholder="Contoh: 1200"
            {...register("jumlah_kk", {
              min: { value: 0, message: "Harus angka positif" },
            })}
          />
          <Input
            label="Jumlah Dusun"
            type="number"
            error={errors.jumlah_dusun?.message}
            placeholder="Contoh: 4"
            {...register("jumlah_dusun", {
              min: { value: 0, message: "Harus angka positif" },
            })}
          />
          <Input
            label="Jumlah RW"
            type="number"
            error={errors.jumlah_rw?.message}
            placeholder="Contoh: 8"
            {...register("jumlah_rw", {
              min: { value: 0, message: "Harus angka positif" },
            })}
          />
        </Section>

        {/* Jam Layanan */}
        <Section title="Jam Operasional">
          <Input
            label="Jam Layanan"
            error={errors.jam_layanan?.message}
            placeholder="Contoh: Senin–Jumat, 08.00–15.00"
            {...register("jam_layanan")}
          />
          <Input
            label="Jam Istirahat"
            error={errors.jam_istirahat?.message}
            placeholder="Contoh: 12.00–13.00"
            {...register("jam_istirahat")}
          />
        </Section>

        {/* Konten */}
        <Section title="Visi, Misi & Sejarah">
          <FullCol>
            <Textarea
              label="Visi"
              rows={3}
              error={errors.visi?.message}
              placeholder="Visi desa..."
              {...register("visi")}
            />
          </FullCol>
          <FullCol>
            <Textarea
              label="Misi"
              rows={4}
              error={errors.misi?.message}
              placeholder="Misi desa..."
              {...register("misi")}
            />
          </FullCol>
          <FullCol>
            <Textarea
              label="Sejarah Desa"
              rows={5}
              error={errors.sejarah?.message}
              placeholder="Sejarah singkat desa..."
              {...register("sejarah")}
            />
          </FullCol>
        </Section>

        {/* Maps & Foto */}
        <Section title="Foto & Lokasi">
          <FullCol>
            <Input
              label="URL Foto Kantor"
              error={errors.foto_kantor?.message}
              placeholder="https://..."
              {...register("foto_kantor")}
            />
          </FullCol>
          <FullCol>
            <Input
              label="Link Google Maps"
              error={errors.maps_link?.message}
              placeholder="https://maps.google.com/..."
              {...register("maps_link")}
            />
          </FullCol>
          <FullCol>
            <Textarea
              label="Embed Maps (iframe)"
              rows={3}
              error={errors.maps_embed?.message}
              placeholder='<iframe src="https://maps.google.com/..." />'
              {...register("maps_embed")}
            />
          </FullCol>
        </Section>

        {/* Tombol bawah untuk kemudahan scroll panjang */}
        <div className="flex justify-end pb-6">
          <Button
            variant="primary"
            icon={Save}
            type="submit"
            loading={isSubmitting}
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilDesaPage;
