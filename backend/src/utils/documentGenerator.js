import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSuratDocument = (templatePath, data, outputFilename) => {
    try {
        // Read the template
        const content = fs.readFileSync(templatePath, 'binary');

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Translate/Format data for template
        // Ensure all fields are strings or empty strings to avoid errors
        const templateData = {
            nomor_surat: data.nomor_surat || '',
            kepala_opd: data.kepala_opd || '',
            no_pdna: data.no_pdna || '',
            nama_pegawai: data.nama_pegawai || '',
            nip: data.nip || '',
            pangkat: data.pangkat || '',
            jabatan: data.jabatan || '',
            opd_new: data.opd_new || '',
            pengirim: data.pengirim || '',
            penerima: data.penerima || '',
            tanggal_surat: data.tanggal_surat ? new Date(data.tanggal_surat).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            }) : '',
            qr_code: data.qr_code_path || '' // TODO: Handle image insertion if needed later
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
