// API endpoint
const BASE_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi untuk mengambil daftar catatan dari API
export async function fetchNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Gagal mengambil catatan:', error);
    throw error;
  }
}

// Fungsi untuk membuat catatan baru melalui API
export async function createNote(note) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Gagal membuat catatan:', error);
    throw error;
  }
}

// Fungsi untuk menghapus catatan melalui API
export async function deleteNote(id) {
  try {
    await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Gagal menghapus catatan:', error);
    throw error;
  }
}

// Fungsi untuk mengarsipkan catatan melalui API
export async function archiveNote(id) {
  try {
    await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Gagal mengarsipkan catatan:', error);
    throw error;
  }
}

// Fungsi untuk mengambil daftar catatan yang diarsipkan dari API
export async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Gagal mengambil catatan yang diarsipkan:', error);
    throw error;
  }
}

// Fungsi untuk mengembalikan catatan dari arsip
export async function unarchiveNote(id) {
  try {
    await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Gagal mengembalikan catatan dari arsip:', error);
    throw error;
  }
}
