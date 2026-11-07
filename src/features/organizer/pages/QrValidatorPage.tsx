import { useEffect, useRef, useState, type FormEvent } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, CheckCircle2, QrCode, RefreshCw, XCircle } from "lucide-react";
import { qrValidationService } from "../services/qrValidationService";
import type { QrValidationResult } from "../types/organizer.types";

export default function QrValidatorPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [result, setResult] = useState<QrValidationResult | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const readerElementId = "qr-reader-container";

  // Enciende la cámara
  const startCamera = async () => {
    setResult(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: 240, aspectRatio: 1.0 },
        async (decodedText) => {
          if (isScanningRef.current) return;
          isScanningRef.current = true;
          await handleValidate(decodedText);
        },
        () => {}
      );

      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  };

  // Apaga la cámara
  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
    }
    setCameraActive(false);
  };

  // Función común de validación
  const handleValidate = async (code: string) => {
    const res = await qrValidationService.validateTicket(code);
    setResult(res);
  };

  // Envío manual desde el input
  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    await handleValidate(manualCode.trim());
    setManualCode("");
  };

  // Reinicia para el siguiente escaneo
  const handleNextScan = () => {
    setResult(null);
    isScanningRef.current = false;
  };

  // Detiene la cámara al salir de la página
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4 space-y-4">
      {/* Estilos para el encuadre completo de la cámara */}
      <style>{`
        #${readerElementId} {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        #${readerElementId} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1rem !important;
        }
        #${readerElementId} img {
          display: none !important;
        }
      `}</style>

      {/* Encabezado */}
      <div className="text-center space-y-0.5">
        <div className="inline-flex items-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wider">
          <QrCode className="w-4 h-4" />
          Control de Acceso
        </div>
        <h1 className="font-display font-extrabold text-2xl text-on-surface">
          Validar Entrada
        </h1>
      </div>

      {/* Tarjeta de Escaneo */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs flex flex-col items-center">
        {/* Botón de Cámara */}
        <div className="mb-3">
          {cameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 transition-colors cursor-pointer"
            >
              <CameraOff className="w-4 h-4 text-on-surface-variant" />
              Desactivar Cámara
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Activar Cámara
            </button>
          )}
        </div>

        {/* Visor de Cámara */}
        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-black/90 border border-outline-variant/40 flex items-center justify-center">
          <div id={readerElementId} className="w-full h-full" />
          {!cameraActive && (
            <div className="text-center p-4 text-white/60">
              <CameraOff className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
              <p className="text-xs">Cámara apagada</p>
            </div>
          )}
        </div>

        {/* Ingreso manual para pruebas con el docente */}
        <form onSubmit={handleManualSubmit} className="w-full max-w-[280px] mt-3.5 flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Ingresar código QR..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-outline-variant/40 bg-surface text-on-surface outline-none focus:border-primary transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shrink-0"
          >
            Validar
          </button>
        </form>
      </div>

      {/* Veredicto de Validación */}
      {result && (
        <div
          className={`rounded-2xl border p-5 text-center shadow-md animate-in fade-in zoom-in-95 duration-150 ${
            result.valido
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950"
              : "bg-rose-500/10 border-rose-500/40 text-rose-950"
          }`}
        >
          {result.valido ? (
            <div className="space-y-1.5">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="font-display font-black text-xl text-emerald-800">
                ACEPTADO
              </h2>
              <p className="text-xs font-semibold text-emerald-700">
                Estado: {result.estado}
              </p>
              <button
                type="button"
                onClick={handleNextScan}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Siguiente
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
              <h2 className="font-display font-black text-xl text-rose-800">
                RECHAZADO
              </h2>
              <p className="text-xs font-semibold text-rose-700">
                Motivo:{" "}
                {result.estado === "USADO"
                  ? "Ya usado"
                  : result.estado === "ANULADO"
                  ? "Anulado"
                  : "No existe"}
              </p>
              <button
                type="button"
                onClick={handleNextScan}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
