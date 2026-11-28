import Swal from "sweetalert2";
import { organizerService } from "../../services/organizerService";
import type { OrganizerEventDetail } from "../../services/organizerMappers";
import { uploadService } from "../../../../shared/services/uploadService";

export interface CategoryOption {
  id: number | string;
  name: string;
}

interface TicketInput {
  name: string;
  zone: string;
  price: number;
  capacity: number;
  saleStartDate?: string;
  saleEndDate?: string;
}

interface FormValues {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  categoryId: number;
  bannerUrl: string;
  tickets: TicketInput[];
}

interface OpenEventFormOptions {
  mode: "create" | "edit";
  categories: CategoryOption[];
  event?: OrganizerEventDetail;
}

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const errorClass =
  "event-form-error hidden text-[11px] font-semibold text-red-600 mt-1";

function fieldErrorHtml(field: string): string {
  return `<p data-error-for="${field}" class="${errorClass}"></p>`;
}

function ticketRowHtml(): string {
  return `
    <div class="ticket-row grid grid-cols-12 gap-2 items-start mb-2">
      <div class="col-span-4">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Nombre</label>
        <input data-field="name" class="${inputClass}" placeholder="General" />
        ${fieldErrorHtml("name")}
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Zona</label>
        <input data-field="zone" class="${inputClass}" placeholder="General" />
        ${fieldErrorHtml("zone")}
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Precio</label>
        <input data-field="price" type="number" min="0" step="0.5" class="${inputClass}" placeholder="0.00" />
        ${fieldErrorHtml("price")}
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Cupo</label>
        <input data-field="capacity" type="number" min="1" class="${inputClass}" placeholder="100" />
        ${fieldErrorHtml("capacity")}
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1 invisible">Acción</label>
        <button type="button" class="remove-ticket w-full py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100">
          Quitar
        </button>
      </div>
    </div>
  `;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Revisa los datos e inténtalo nuevamente.";
}

function getErrorElement(input: FieldElement): HTMLElement | null {
  const key =
    input.getAttribute("data-error-for") ??
    input.getAttribute("data-field") ??
    input.getAttribute("name");
  if (!key) return null;
  return input
    .closest("div")
    ?.querySelector<HTMLElement>(`[data-error-for="${key}"]`) ?? null;
}

function setFieldError(input: FieldElement, message: string) {
  input.setAttribute("aria-invalid", "true");
  input.style.borderColor = "#ba1a1a";
  input.style.boxShadow = "0 0 0 2px rgba(186, 26, 26, 0.15)";

  const error = getErrorElement(input);
  if (error) {
    error.textContent = message;
    error.classList.remove("hidden");
  }
}

function clearFieldError(input: FieldElement) {
  input.removeAttribute("aria-invalid");
  input.style.borderColor = "";
  input.style.boxShadow = "";

  const error = getErrorElement(input);
  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }
}

function clearAllErrors(form: HTMLFormElement) {
  form.querySelectorAll<FieldElement>("[aria-invalid='true']").forEach((input) => {
    clearFieldError(input);
  });
  form.querySelectorAll<HTMLElement>(".event-form-error").forEach((error) => {
    error.textContent = "";
    error.classList.add("hidden");
  });
}

export async function openEventFormSwal({
  mode,
  categories,
  event,
}: OpenEventFormOptions): Promise<boolean> {
  const isEdit = mode === "edit";
  const selectedCategory = event?.categoryId ?? categories[0]?.id ?? "";
  const categoryOptions = categories
    .map(
      (c) =>
        `<option value="${c.id}" ${String(c.id) === String(selectedCategory) ? "selected" : ""}>${c.name}</option>`
    )
    .join("");

  const result = await Swal.fire<FormValues>({
    title: isEdit ? "Editar evento" : "Crear evento",
    width: 760,
    confirmButtonText: isEdit ? "Guardar cambios" : "Crear evento",
    cancelButtonText: "Cancelar",
    showCancelButton: true,
    confirmButtonColor: "#3525cd",
    focusConfirm: false,
    html: `
      <form id="event-form" class="text-left flex flex-col gap-3">
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Nombre del evento *</label>
          <input name="title" class="${inputClass}" value="${event?.title ?? ""}" placeholder="Festival de Verano" />
          ${fieldErrorHtml("title")}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Categoría *</label>
            <select name="categoryId" class="${inputClass}">${categoryOptions}</select>
            ${fieldErrorHtml("categoryId")}
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Aforo total *</label>
            <input name="capacity" type="number" min="1" class="${inputClass}" value="${event?.capacity ?? ""}" placeholder="500" />
            ${fieldErrorHtml("capacity")}
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Lugar / Sede *</label>
          <input name="location" class="${inputClass}" value="${event?.venue ?? ""}" placeholder="Arena 1, San Miguel" />
          ${fieldErrorHtml("location")}
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Fecha *</label>
            <input name="date" type="date" class="${inputClass}" value="${event?.date ?? ""}" />
            ${fieldErrorHtml("date")}
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Hora inicio *</label>
            <input name="startTime" type="time" class="${inputClass}" value="${event?.startTime ?? ""}" />
            ${fieldErrorHtml("startTime")}
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Hora fin *</label>
            <input name="endTime" type="time" class="${inputClass}" value="${event?.endTime ?? ""}" />
            ${fieldErrorHtml("endTime")}
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Descripción</label>
          <textarea name="description" rows="2" class="${inputClass}">${event?.description ?? ""}</textarea>
          ${fieldErrorHtml("description")}
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Banner del evento</label>
          <div class="flex gap-2 items-center mb-1.5">
            <input name="bannerUrl" id="event-banner-url" class="${inputClass} flex-1" value="${event?.bannerUrl ?? ""}" placeholder="https://res.cloudinary.com/..." />
            <input type="file" id="cloudinary-file-input" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden" />
            <button type="button" id="cloudinary-upload-btn" class="shrink-0 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Subir imagen</span>
            </button>
          </div>
          <p id="upload-status" class="text-[11px] hidden mb-1.5"></p>
          <div id="banner-preview-container" class="${event?.bannerUrl ? "" : "hidden"} rounded-lg overflow-hidden border border-gray-200 bg-gray-50 max-h-36 flex items-center justify-center relative">
            <img id="banner-preview-img" src="${event?.bannerUrl ?? ""}" alt="Vista previa del banner" class="w-full h-36 object-cover" />
          </div>
          ${fieldErrorHtml("bannerUrl")}
        </div>
        ${
          isEdit
            ? ""
            : `
          <div class="pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-700">Entradas y tarifas</span>
              <button type="button" id="add-ticket" class="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20">
                + Agregar tarifa
              </button>
            </div>
            <div id="ticket-rows">${ticketRowHtml()}</div>
            ${fieldErrorHtml("tickets")}
          </div>
        `
        }
      </form>
    `,
    didOpen: () => {
      const form = document.getElementById("event-form") as HTMLFormElement | null;
      const rows = document.getElementById("ticket-rows");
      document.getElementById("add-ticket")?.addEventListener("click", () => {
        rows?.insertAdjacentHTML("beforeend", ticketRowHtml());
      });
      rows?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("remove-ticket")) {
          target.closest(".ticket-row")?.remove();
        }
      });
      form?.addEventListener("input", (e) => {
        const target = e.target;
        if (target instanceof HTMLElement && target.matches("input, select, textarea")) {
          clearFieldError(target as FieldElement);
        }
      });
      form?.addEventListener("change", (e) => {
        const target = e.target;
        if (target instanceof HTMLElement && target.matches("input, select, textarea")) {
          clearFieldError(target as FieldElement);
        }
      });

      const fileInput = document.getElementById("cloudinary-file-input") as HTMLInputElement | null;
      const uploadBtn = document.getElementById("cloudinary-upload-btn") as HTMLButtonElement | null;
      const bannerUrlInput = document.getElementById("event-banner-url") as HTMLInputElement | null;
      const uploadStatus = document.getElementById("upload-status") as HTMLParagraphElement | null;
      const previewContainer = document.getElementById("banner-preview-container") as HTMLDivElement | null;
      const previewImg = document.getElementById("banner-preview-img") as HTMLImageElement | null;

      uploadBtn?.addEventListener("click", () => {
        fileInput?.click();
      });

      fileInput?.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
          if (uploadStatus) {
            uploadStatus.textContent = "El archivo excede el límite de 10MB.";
            uploadStatus.className = "text-[11px] text-red-600 block mb-1.5";
          }
          return;
        }

        try {
          if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.classList.add("opacity-50", "cursor-not-allowed");
          }
          if (uploadStatus) {
            uploadStatus.textContent = "Subiendo imagen a Cloudinary...";
            uploadStatus.className = "text-[11px] text-primary font-medium block mb-1.5 animate-pulse";
          }

          const result = await uploadService.uploadImage(file, "eventia/banners");

          if (bannerUrlInput) {
            bannerUrlInput.value = result.url;
            bannerUrlInput.dispatchEvent(new Event("input", { bubbles: true }));
          }

          if (previewImg && previewContainer) {
            previewImg.src = result.url;
            previewContainer.classList.remove("hidden");
          }

          if (uploadStatus) {
            uploadStatus.textContent = "Imagen subida exitosamente a Cloudinary.";
            uploadStatus.className = "text-[11px] text-emerald-600 font-medium block mb-1.5";
          }
        } catch (err: any) {
          const msg = err?.response?.data?.message || err?.message || "Error al subir imagen a Cloudinary";
          if (uploadStatus) {
            uploadStatus.textContent = `Error: ${msg}`;
            uploadStatus.className = "text-[11px] text-red-600 block mb-1.5";
          }
        } finally {
          if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.classList.remove("opacity-50", "cursor-not-allowed");
          }
          fileInput.value = "";
        }
      });

      bannerUrlInput?.addEventListener("input", () => {
        const url = bannerUrlInput.value.trim();
        if (url && previewImg && previewContainer) {
          previewImg.src = url;
          previewContainer.classList.remove("hidden");
        } else if (!url && previewContainer) {
          previewContainer.classList.add("hidden");
        }
      });
    },
    preConfirm: () => {
      const form = document.getElementById("event-form") as HTMLFormElement | null;
      if (!form) return false;
      const value = (name: string) =>
        (form.querySelector(`[name="${name}"]`) as HTMLInputElement | null)?.value.trim() ?? "";
      const input = (name: string) =>
        form.querySelector<FieldElement>(`[name="${name}"]`);

      clearAllErrors(form);

      let firstInvalid: HTMLElement | null = null;
      const mark = (element: FieldElement | null, message: string) => {
        if (!element) return;
        setFieldError(element, message);
        if (!firstInvalid) firstInvalid = element;
      };

      const title = value("title");
      const date = value("date");
      const startTime = value("startTime");
      const endTime = value("endTime");
      const location = value("location");
      const capacity = Number(value("capacity"));
      const categoryId = Number(value("categoryId"));

      if (!title) mark(input("title"), "Ingresa el nombre del evento.");
      if (!date) mark(input("date"), "Selecciona la fecha.");
      if (!startTime) mark(input("startTime"), "Ingresa la hora de inicio.");
      if (!endTime) mark(input("endTime"), "Ingresa la hora de fin.");
      if (!location) mark(input("location"), "Ingresa el lugar.");
      if (!capacity || capacity <= 0) mark(input("capacity"), "El aforo debe ser mayor a 0.");
      if (!categoryId) mark(input("categoryId"), "Selecciona una categoría.");

      const tickets: TicketInput[] = [];
      if (!isEdit) {
        const rows = form.querySelectorAll(".ticket-row");
        for (const row of Array.from(rows)) {
          const field = (name: string) =>
            (row.querySelector(`[data-field="${name}"]`) as HTMLInputElement | null)?.value.trim() ?? "";
          const name = field("name");
          const rawPrice = field("price");
          const price = Number(rawPrice);
          const rawCapacity = field("capacity");
          const ticketCapacity = Number(rawCapacity);

          if (!name) mark(row.querySelector('[data-field="name"]'), "Ingresa el nombre de la tarifa.");
          if (!rawPrice || Number.isNaN(price) || price < 0) {
            mark(row.querySelector('[data-field="price"]'), "Ingresa un precio válido.");
          }
          if (!rawCapacity || ticketCapacity <= 0) {
            mark(row.querySelector('[data-field="capacity"]'), "Ingresa un cupo mayor a 0.");
          }

          tickets.push({
            name,
            zone: field("zone") || "General",
            price,
            capacity: ticketCapacity,
          });
        }
        if (tickets.length === 0) {
          const ticketError = form.querySelector<HTMLElement>('[data-error-for="tickets"]');
          if (ticketError) {
            ticketError.textContent = "Agrega al menos una tarifa.";
            ticketError.classList.remove("hidden");
          }
          if (!firstInvalid) {
            firstInvalid = document.getElementById("add-ticket");
          }
        }
      }

      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ block: "nearest", behavior: "smooth" });
        return false;
      }

      return {
        title,
        description: value("description"),
        date,
        startTime,
        endTime,
        location,
        capacity,
        categoryId,
        bannerUrl: value("bannerUrl"),
        tickets,
      };
    },
  });

  if (!result.isConfirmed || !result.value) return false;
  const values = result.value;

  try {
    if (isEdit && event) {
      await organizerService.updateEvent(event.id, {
        title: values.title,
        description: values.description,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        venue: values.location,
        location: values.location,
        capacity: values.capacity,
        categoryId: values.categoryId,
        bannerUrl: values.bannerUrl,
        status: event.status,
      });
    } else {
      const created = await organizerService.createEvent({
        title: values.title,
        description: values.description,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        venue: values.location,
        location: values.location,
        capacity: values.capacity,
        categoryId: values.categoryId,
        bannerUrl: values.bannerUrl || undefined,
        active: true,
      });
      for (const ticket of values.tickets) {
        await organizerService.createTicketType({
          eventId: created.id,
          name: ticket.name,
          zone: ticket.zone,
          pricePEN: ticket.price,
          capacity: ticket.capacity,
          status: "active",
        });
      }
    }
    return true;
  } catch (error: unknown) {
    await Swal.fire({
      icon: "error",
      title: "No se pudo guardar",
      text: getErrorMessage(error),
      confirmButtonColor: "#3525cd",
    });
    return false;
  }
}
