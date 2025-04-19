import '../style.css';

// Custom element untuk item catatan
class NoteItemElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const styleElem = document.createElement('style');
    styleElem.textContent = `
        .note-item {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: default;
            display: flex;
            flex-direction: column;
            min-height: 300px;
        }

        @keyframes shakeAnimation {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
            100% { transform: translateX(0); }
        }

        .note-item:hover {
            animation: shakeAnimation 0.5s ease;
            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }

        .note-title {
            margin: 0;
            color: #2c3e50;
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 12px;
        }

        .note-body {
            flex: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 10px;
        }

        .note-date {
            margin-top: auto;
            text-align: right;
            color: #7f8c8d;
            font-size: 0.8rem;
        }

        .delete-note-btn {
            background-color: #cb4b3a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s ease;
            font-weight: 600;
        }

        .delete-note-btn:hover {
            background-color: #a13629;
        }

        .archive-note-btn {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.3s ease;
            font-weight: 600;
        }

        .archive-note-btn:hover {
            background-color: #27ae60;
        }
    `;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'note-item');

    const titleElem = document.createElement('h3');
    titleElem.setAttribute('class', 'note-title');
    titleElem.textContent = this.getAttribute('title') || 'Catatan Tanpa Judul';

    const bodyElem = document.createElement('div');
    bodyElem.setAttribute('class', 'note-body');
    bodyElem.textContent = this.getAttribute('body') || 'Tidak ada konten';

    const dateElem = document.createElement('div');
    dateElem.setAttribute('class', 'note-date');
    dateElem.textContent = this.getAttribute('date') || new Date().toLocaleDateString('id-ID');

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'delete-note-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          bubbles: true,
          composed: true,
          detail: { id: this.getAttribute('id') },
        })
      );
    });

    const archiveBtn = document.createElement('button');
    archiveBtn.setAttribute('class', 'archive-note-btn');
    const isArchived = this.hasAttribute('archived');
    archiveBtn.textContent = isArchived ? 'Unarchive' : 'Archive';

    archiveBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent(isArchived ? 'unarchive-note' : 'archive-note', {
          bubbles: true,
          composed: true,
          detail: { id: this.getAttribute('id') },
        })
      );
    });

    wrapper.appendChild(titleElem);
    wrapper.appendChild(bodyElem);
    wrapper.appendChild(dateElem);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(archiveBtn);

    shadow.appendChild(styleElem);
    shadow.appendChild(wrapper);
  }
}

// Custom element untuk header aplikasi
class NotesHeaderElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const styleElem = document.createElement('style');
    styleElem.textContent = `
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e4e8;
        }

        .header-title {
            font-size: 2.5rem;
            color: #2980b9;
            font-weight: 700;
            cursor: pointer;
        }

        .header-title:hover {
            color: #1abc9c;
            transition: color 0.3s ease;
        }

        .add-note-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-weight: 600;
        }

        .add-note-btn:hover {
            background-color: #2980b9;
        }

        .dropdown-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
        }

        .notes-view-dropdown {
            padding: 8px 12px;
            border: 1px solid #e0e4e8;
            border-radius: 5px;
            font-size: 1rem;
            background-color: white;
            cursor: pointer;
        }
    `;

    const header = document.createElement('header');

    const titleElem = document.createElement('div');
    titleElem.setAttribute('class', 'header-title');
    titleElem.textContent = this.getAttribute('title') || 'Catatan Saya';

    const addNoteBtn = document.createElement('button');
    addNoteBtn.setAttribute('class', 'add-note-btn');
    addNoteBtn.textContent = '+ Catatan Baru';

    addNoteBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('add-note', {
          bubbles: true,
          composed: true,
        })
      );
    });

    const dropdown = document.createElement('select');
    dropdown.setAttribute('class', 'notes-view-dropdown');

    const activeOption = document.createElement('option');
    activeOption.value = 'active';
    activeOption.textContent = 'Active Notes';
    dropdown.appendChild(activeOption);

    const archivedOption = document.createElement('option');
    archivedOption.value = 'archived';
    archivedOption.textContent = 'Archived Notes';
    dropdown.appendChild(archivedOption);

    dropdown.addEventListener('change', () => {
      const showArchived = dropdown.value === 'archived';
      this.dispatchEvent(
        new CustomEvent('switch-view', {
          bubbles: true,
          composed: true,
          detail: { showArchived },
        })
      );
    });

    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.setAttribute('class', 'dropdown-wrapper');
    dropdownWrapper.appendChild(dropdown);

    header.appendChild(titleElem);
    header.appendChild(addNoteBtn);

    shadow.appendChild(styleElem);
    shadow.appendChild(header);
    shadow.appendChild(dropdownWrapper);
  }
}

// Custom element untuk modal catatan
class NoteModalElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const styleElem = document.createElement('style');
    styleElem.textContent = `
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            position: relative;
            width: 90%;
            max-width: 700px;
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            color: #7f8c8d;
            cursor: pointer;
            transition: color 0.3s ease;
            padding: 10px;
            border-radius: 50%;
        }

        .close-btn:hover {
            color: #2c3e50;
            background-color: rgba(0, 0, 0, 0.1);
        }

        #noteForm {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        #noteForm input,
        #noteForm textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #e0e4e8;
            border-radius: 5px;
            font-size: 1rem;
        }

        #noteForm textarea {
            flex-grow: 1;
            resize: none;
            margin-bottom: 20px;
        }

        #noteForm button {
            background-color: #2980b9;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-weight: 600;
            margin-top: auto;
        }

        #noteForm button:hover {
            background-color: #206390;
        }
    `;

    const modalOverlay = document.createElement('div');
    modalOverlay.setAttribute('class', 'modal-overlay');
    modalOverlay.setAttribute('id', 'noteModal');

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');

    const closeBtn = document.createElement('span');
    closeBtn.setAttribute('class', 'close-btn');
    closeBtn.textContent = '×';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Edit Catatan';

    const form = document.createElement('form');
    form.setAttribute('id', 'noteForm');

    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'noteTitle');
    titleInput.setAttribute('placeholder', 'Judul');
    titleInput.setAttribute('required', '');

    titleInput.addEventListener('input', () => {
      if (titleInput.value.trim() === '') {
        titleInput.setCustomValidity('Judul wajib diisi.');
      } else {
        titleInput.setCustomValidity('');
      }
      titleInput.reportValidity();
    });

    const bodyTextarea = document.createElement('textarea');
    bodyTextarea.setAttribute('id', 'noteBody');
    bodyTextarea.setAttribute('placeholder', 'Isi catatan di sini...');
    bodyTextarea.setAttribute('required', '');

    bodyTextarea.addEventListener('input', () => {
      if (bodyTextarea.value.trim() === '') {
        bodyTextarea.setCustomValidity('Isi catatan wajib diisi.');
      } else {
        bodyTextarea.setCustomValidity('');
      }
      bodyTextarea.reportValidity();
    });

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = 'Simpan';

    closeBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('close-modal', {
          bubbles: true,
          composed: true,
        })
      );
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!titleInput.checkValidity() || !bodyTextarea.checkValidity()) {
        return;
      }
      const title = titleInput.value;
      const body = bodyTextarea.value;

      this.dispatchEvent(
        new CustomEvent('save-note', {
          bubbles: true,
          composed: true,
          detail: { title, body },
        })
      );
    });

    form.appendChild(titleInput);
    form.appendChild(bodyTextarea);
    form.appendChild(submitBtn);

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);

    modalOverlay.appendChild(modalContent);

    shadow.appendChild(styleElem);
    shadow.appendChild(modalOverlay);
  }

  open() {
    const modalOverlay = this.shadowRoot.querySelector('.modal-overlay');
    modalOverlay.style.display = 'flex';
  }

  close() {
    const modalOverlay = this.shadowRoot.querySelector('.modal-overlay');
    modalOverlay.style.display = 'none';
  }

  setNoteValues(title, body) {
    const titleInput = this.shadowRoot.querySelector('#noteTitle');
    const bodyTextarea = this.shadowRoot.querySelector('#noteBody');
    titleInput.value = title;
    bodyTextarea.value = body;
  }
}

// Custom element untuk indikator loading
class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const styleElem = document.createElement('style');
    styleElem.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;

    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'loading-overlay');

    const spinner = document.createElement('div');
    spinner.setAttribute('class', 'spinner');

    overlay.appendChild(spinner);

    shadow.appendChild(styleElem);
    shadow.appendChild(overlay);
  }
}

// Mendefinisikan custom elements
customElements.define('note-item', NoteItemElement);
customElements.define('notes-header', NotesHeaderElement);
customElements.define('notes-modal', NoteModalElement);
customElements.define('loading-indicator', LoadingIndicator);
