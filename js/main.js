import '../style.css';
import './components.js';
import './notes.js';
import { fetchNotes, createNote, deleteNote, archiveNote, fetchArchivedNotes, unarchiveNote } from './notes.js';
import Swal from 'sweetalert2';

const notesContainer = document.getElementById('notesContainer');

// Menambahkan state untuk melacak tampilan saat ini
let isArchivedView = false;

// Fungsi untuk menampilkan indikator loading dengan delay minimum
async function showLoadingIndicatorWithDelay(minimumDelay = 250) {
    const loadingIndicator = document.createElement('loading-indicator');
    loadingIndicator.setAttribute('id', 'loadingIndicator');
    document.body.appendChild(loadingIndicator);

    // Menunggu minimum delay sebelum melanjutkan
    await new Promise((resolve) => setTimeout(resolve, minimumDelay));
}

// Fungsi untuk menyembunyikan indikator loading
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        document.body.removeChild(loadingIndicator);
    }
}

// Fungsi untuk menampilkan pesan error menggunakan SweetAlert
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

// Fungsi untuk menampilkan pesan sukses menggunakan SweetAlert
function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: message,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

// Fungsi untuk menampilkan konfirmasi sebelum menghapus catatan
async function confirmDeleteNote() {
    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Catatan yang dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });

    return result.isConfirmed;
}

// Fungsi utama untuk memuat dan merender catatan, termasuk menangani error dan loading
async function loadAndRenderNotes(isArchivedView = false) {
    const loadingPromise = showLoadingIndicatorWithDelay();
    try {
        const notes = isArchivedView ? await fetchArchivedNotes() : await fetchNotes();
        await loadingPromise; // Pastikan delay minimum terpenuhi
        renderNotes(notes, isArchivedView);
    } catch (error) {
        console.error('Error loading notes:', error);
        showError('Gagal memuat catatan. Silakan coba lagi.');
    } finally {
        hideLoadingIndicator();
    }
}

// Fungsi untuk merender catatan ke dalam container
function renderNotes(notes, isArchivedView) {
    // Mengurutkan catatan berdasarkan tanggal pembuatan secara descending
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    notesContainer.innerHTML = '';

    notes.forEach((note) => {
        const noteElement = document.createElement('note-item');
        noteElement.setAttribute('id', note.id);
        noteElement.setAttribute('title', note.title);
        noteElement.setAttribute('body', note.body);
        if (isArchivedView) {
            noteElement.setAttribute('archived', '');
        }

        const formattedDate = new Date(note.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        noteElement.setAttribute('date', formattedDate);
        notesContainer.appendChild(noteElement);
    });
}

// Event listener utama untuk menangani berbagai interaksi pengguna
// Termasuk delete-note, archive-note, unarchive-note, switch-view, dan add-note
document.addEventListener('DOMContentLoaded', () => {
    // Event listener utama untuk menangani berbagai interaksi pengguna
    loadAndRenderNotes(isArchivedView);

    // Menambahkan event listener untuk delete-note
    document.addEventListener('delete-note', async (event) => {
        try {
            const noteId = event.detail.id;
            const isConfirmed = await confirmDeleteNote();
            if (isConfirmed) {
                await deleteNote(noteId);
                loadAndRenderNotes(isArchivedView);
                showSuccess('Catatan berhasil dihapus!');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            showError('Gagal menghapus catatan. Silakan coba lagi.');
        }
    });

    // Event listener for archive-note
    document.addEventListener('archive-note', async (event) => {
        try {
            const noteId = event.detail.id;
            await archiveNote(noteId);
            loadAndRenderNotes(isArchivedView);
        } catch (error) {
            console.error('Error archiving note:', error);
        }
    });

    // Event listener untuk unarchive-note
    document.addEventListener('unarchive-note', async (event) => {
        try {
            const noteId = event.detail.id;
            await unarchiveNote(noteId);
            loadAndRenderNotes(isArchivedView);
        } catch (error) {
            console.error('Error unarchiving note:', error);
        }
    });

    // Event listener for switch-view
    document.addEventListener('switch-view', async (event) => {
        try {
            const { showArchived } = event.detail;
            isArchivedView = showArchived;
            loadAndRenderNotes(isArchivedView);
        } catch (error) {
            console.error('Error switching view:', error);
        }
    });

    // Modifikasi event listener untuk add-note
    document.addEventListener('add-note', () => {
        const modal = document.createElement('notes-modal');
        document.body.appendChild(modal);
        modal.open();

        document.addEventListener('close-modal', () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, { once: true });

        document.addEventListener('save-note', async (event) => {
            const loadingPromise = showLoadingIndicatorWithDelay();
            try {
                const { title, body } = event.detail;
                await createNote({ title, body });
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                await loadingPromise;
                loadAndRenderNotes(isArchivedView);
                showSuccess('Catatan berhasil ditambahkan!');
            } catch (error) {
                console.error('Error creating note:', error);
                showError('Gagal menyimpan catatan. Silakan coba lagi.');
            } finally {
                hideLoadingIndicator();
            }
        }, { once: true });
    });
});
