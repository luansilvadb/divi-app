export function useOverlayPt(options?: { blurBackdrop?: boolean }) {
  const blurBackdrop = options?.blurBackdrop !== false

  const modalPt = {
    root: { class: 'modal-wrapper flex items-center justify-center overflow-hidden' },
    mask: {
      class: [
        'modal-backdrop transition-all duration-500 z-[150]',
        blurBackdrop ? 'bg-[#0e121b80] backdrop-blur-md' : 'bg-black/50'
      ]
    },
    content: { class: 'modal-content relative w-full z-[160] !p-0 !bg-transparent' },
  }

  const bottomSheetPt = {
    mask: { class: ['z-[90]', blurBackdrop ? 'backdrop-blur-sm bg-black/40' : 'bg-black/50'] },
    root: { class: 'z-[100]' },
    header: { class: 'p-0 border-none hidden' },
    content: { class: 'p-0 !bg-transparent' },
  }

  return { modalPt, bottomSheetPt }
}
