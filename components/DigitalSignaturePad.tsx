'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Check } from 'lucide-react';

interface DigitalSignaturePadProps {
  onSignatureCapture: (signatureData: string) => void;
  label?: string;
  isLoading?: boolean;
}

export default function DigitalSignaturePad({
  onSignatureCapture,
  label = 'Draw Your Signature',
  isLoading = false,
}: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 150;

    // Set background and styles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setContext(ctx);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);

    // Check if canvas has any drawing
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let hasPixels = false;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 128) {
          // Check alpha channel
          hasPixels = true;
          break;
        }
      }

      setHasSignature(hasPixels);
    }
  };

  const clearSignature = () => {
    if (!context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.stroke();
    setHasSignature(false);
  };

  const submitSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    // Convert canvas to base64
    const signatureData = canvas.toDataURL('image/png');
    onSignatureCapture(signatureData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3">
          {label}
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Sign in the box below. Ensure your full signature is visible.
        </p>
      </div>

      <div className="border-2 border-dashed border-reset-green/50 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full cursor-crosshair block"
          style={{ minHeight: '150px' }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearSignature}
          disabled={!hasSignature || isLoading}
          className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Clear
        </button>
        <button
          onClick={submitSignature}
          disabled={!hasSignature || isLoading}
          className="flex-1 px-4 py-2 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin inline-block">⏳</span>
              Signing...
            </>
          ) : (
            <>
              <Check size={16} />
              Confirm Signature
            </>
          )}
        </button>
      </div>

      {hasSignature && (
        <p className="text-xs text-reset-green">✓ Signature ready to submit</p>
      )}
    </motion.div>
  );
}
