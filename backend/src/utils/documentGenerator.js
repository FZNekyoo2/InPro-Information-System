import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSuratDocument = (templatePath, data, outputFilename) => {
    try {
        // Read the template
        const content = fs.readFileSync(templatePath, 'binary');

        // Image Module Option
        const opts = {};
        opts.centered = false; // Set to true to always center images
        opts.fileType = "docx";

        // Pass your image loader
        opts.getImage = function (tagValue, tagName) {
            // tagValue is the value of the tag in the data object (e.g., /path/to/image.png)
            // We expect tagValue to be an absolute file path
            if (!tagValue) return null;
            return fs.readFileSync(tagValue);
        };

        opts.getSize = function (img, tagValue, tagName) {
            // You can return [width, height]
            // Fixed size for QR Code: 150x150
            return [150, 150];
        };

        const imageModule = new ImageModule(opts);

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            modules: [imageModule]
        });

        // Translate/Format data for template
        // Ensure all fields are strings or empty strings to avoid errors
        const formattedTanggalSurat = data.tanggal_surat ? new Date(data.tanggal_surat).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        }) : '';

        // Parse Pangkat/Golongan
        // Logic: If pangkat contains " / (", it's likely a combined string "Pangkat / (Golongan)"
        // We split it so {pangkat} is just Rank and {golongan} is Class
        let pangkat = data.pangkat || '';
        let golongan = '';

        // If Pangkat string was combined by ManageSurat (e.g. "Penata / (III/c)"), split it.
        if (pangkat.includes(' / (')) {
            const parts = pangkat.split(' / (');
            if (parts.length === 2) {
                pangkat = parts[0].trim();
                golongan = '(' + parts[1].trim(); // Keep the formatting e.g. "(III/c)"
            }
        }

        const templateData = {
            nomor_surat: data.nomor_surat || '',
            kepala_opd: data.kepala_opd || '',
            no_pdna: data.no_pdna || '',
            nama_pegawai: data.nama_pegawai || '',
            nip: data.nip || '',
            pangkat: pangkat,
            golongan: golongan,
            pangkat_lengkap: data.pangkat || '', // Backup key
            jabatan: data.jabatan || '',
            opd_new: data.opd_new || '',
            pengirim: data.pengirim || '',
            penerima: data.penerima || '',
            tanggal_surat: formattedTanggalSurat,
            tanggal_opd: formattedTanggalSurat,
            qr_code: data.qr_code_path || null
        };

        doc.render(templateData);

        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        // Ensure output directory exists (relative to backend root, usually 'uploads/converted')
        const outputDir = path.join(__dirname, '../../uploads/generated_surat');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fullOutputPath = path.join(outputDir, outputFilename);
        fs.writeFileSync(fullOutputPath, buf);

        return `/uploads/generated_surat/${outputFilename}`;
    } catch (error) {
        console.error('Error generating document:', error);
        throw error;
    }
};
