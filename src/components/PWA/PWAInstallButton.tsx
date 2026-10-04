import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Share,
  CheckCircle2,
  X,
  Smartphone,
  Laptop,
  Apple,
  Chrome,
  ShieldCheck,
} from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If running inside standalone app already
  if (isStandalone) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg text-xs font-mono text-stone-600">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed App Mode</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const result = await install();
      if (result) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
        return;
      }
    }
    // If not direct 1-click installable or on iOS/Safari, show the comprehensive install guide modal
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install OperateX App on your device"
        className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:shadow cursor-pointer border border-stone-700/60"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>Install App</span>
      </button>

      {/* Install App Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-300 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold font-mono">
                  OX
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Install OperateX AI</h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Progressive Web App · Zero download latency
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct 1-Click trigger if available */}
            {isInstallable && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    Instant 1-Click Installation Ready
                  </span>
                  <span className="text-[11px] text-amber-800 font-mono">
                    Install standalone app window directly onto your desktop or phone.
                  </span>
                </div>
                <button
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowModal(false);
                  }}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                >
                  Install Now
                </button>
              </div>
            )}

            {/* Step-by-Step Instructions based on OS / Browser */}
            <div className="space-y-3.5 text-xs text-stone-700">
              {/* Chrome / Edge / Desktop */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Laptop className="w-4 h-4 text-stone-700" />
                  <span>Chrome, Edge & Brave (Desktop / PC / Mac)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                  <li>
                    Look at the right side of your browser address (URL) bar for the{' '}
                    <strong>Install / Download icon</strong> (<Download className="w-3 h-3 inline text-stone-800" />).
                  </li>
                  <li>Click <strong>Install OperateX</strong> to add it to your Desktop, Dock, or Start Menu.</li>
                  <li>Launches with its own native window without browser toolbars.</li>
                </ol>
              </div>

              {/* iOS / Safari */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Apple className="w-4 h-4 text-stone-700" />
                  <span>Safari on iPhone, iPad & Mac</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                  <li>
                    Tap or click the <strong>Share</strong> button (<Share className="w-3 h-3 inline text-stone-800" />) in the toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong>"Add to Home Screen"</strong> (or <strong>"Add to Dock"</strong> on Mac).
                  </li>
                  <li>Confirm <strong>"Add"</strong>. The app icon will appear instantly on your home screen.</li>
                </ol>
              </div>

              {/* Android */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Smartphone className="w-4 h-4 text-stone-700" />
                  <span>Android (Chrome & Firefox)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-600 pl-1">
                  <li>
                    Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.
                  </li>
                  <li>
                    Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                </ol>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Service worker offline support enabled
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
