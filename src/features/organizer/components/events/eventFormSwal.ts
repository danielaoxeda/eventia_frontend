import Swal from "sweetalert2";
import { organizerService } from "../../services/organizerService";
import type { OrganizerEventDetail } from "../../services/organizerMappers";

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

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

function ticketRowHtml(): string {
  return `
    <div class="ticket-row grid grid-cols-12 gap-2 items-end mb-2">
      <div class="col-span-4">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Nombre</label>
        <input data-field="name" class="${inputClass}" placeholder="General" />
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Zona</label>
        <input data-field="zone" class="${inputClass}" placeholder="General" />
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Precio</label>
        <input data-field="price" type="number" min="0" step="0.5" class="${inputClass}" placeholder="0.00" />
      </div>
      <div class="col-span-2">
        <label class="block text-[11px] font-semibold text-gray-600 mb-1">Cupo</label>
        <input data-field="capacity" type="number" min="1" class="${inputClass}" placeholder="100" />
      </div>
      <div class="col-span-2">
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
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Categoría *</label>
            <select name="categoryId" class="${inputClass}">${categoryOptions}</select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Aforo total *</label>
            <input name="capacity" type="number" min="1" class="${inputClass}" value="${event?.capacity ?? ""}" placeholder="500" />
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Lugar / Sede *</label>
          <input name="location" class="${inputClass}" value="${event?.venue ?? ""}" placeholder="Arena 1, San Miguel" />
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Fecha *</label>
            <input name="date" type="date" class="${inputClass}" value="${event?.date ?? ""}" />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Hora inicio *</label>
            <input name="startTime" type="time" class="${inputClass}" value="${event?.startTime ?? ""}" />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Hora fin *</label>
            <input name="endTime" type="time" class="${inputClass}" value="${event?.endTime ?? ""}" />
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">Descripción</label>
          <textarea name="description" rows="2" class="${inputClass}">${event?.description ?? ""}</textarea>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-gray-600 mb-1">URL del banner</label>
          <input name="bannerUrl" class="${inputClass}" value="${event?.bannerUrl ?? ""}" placeholder="https://..." />
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
          </div>
        `
        }
      </form>
    `,
    didOpen: () => {
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
    },
    preConfirm: () => {
      const form = document.getElementById("event-form") as HTMLFormElement | null;
      if (!form) return false;
      const value = (name: string) =>
        (form.querySelector(`[name="${name}"]`) as HTMLInputElement | null)?.value.trim() ?? "";

      const title = value("title");
      const date = value("date");
      const startTime = value("startTime");
      const endTime = value("endTime");
      const location = value("location");
      const capacity = Number(value("capacity"));
      const categoryId = Number(value("categoryId"));

      if (!title) return Swal.showValidationMessage("Ingresa el nombre del evento.");
      if (!date) return Swal.showValidationMessage("Selecciona la fecha.");
      if (!startTime || !endTime) return Swal.showValidationMessage("Ingresa las horas de inicio y fin.");
      if (!location) return Swal.showValidationMessage("Ingresa el lugar.");
      if (!capacity || capacity <= 0) return Swal.showValidationMessage("El aforo debe ser mayor a 0.");
      if (!categoryId) return Swal.showValidationMessage("Selecciona una categoría.");

      const tickets: TicketInput[] = [];
      if (!isEdit) {
        const rows = form.querySelectorAll(".ticket-row");
        for (const row of Array.from(rows)) {
          const field = (name: string) =>
            (row.querySelector(`[data-field="${name}"]`) as HTMLInputElement | null)?.value.trim() ?? "";
          const name = field("name");
          const price = Number(field("price"));
          const ticketCapacity = Number(field("capacity"));
          if (!name) return Swal.showValidationMessage("Cada tarifa necesita un nombre.");
          if (Number.isNaN(price) || price < 0)
            return Swal.showValidationMessage("Cada tarifa necesita un precio válido.");
          if (!ticketCapacity || ticketCapacity <= 0)
            return Swal.showValidationMessage("Cada tarifa necesita un cupo mayor a 0.");
          tickets.push({
            name,
            zone: field("zone") || "General",
            price,
            capacity: ticketCapacity,
          });
        }
        if (tickets.length === 0) return Swal.showValidationMessage("Agrega al menos una tarifa.");
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
