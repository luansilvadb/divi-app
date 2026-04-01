const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, 'src/shared/components/molecules/BaseBottomSheet.vue')
let content = fs.readFileSync(file, 'utf8')

// The review says: "The touch drag events must be restricted strictly to the drag handle (div at the top) OR the onTouchMove logic must be updated to only drag the sheet if the scrollable content area is at scrollTop === 0."
// Let's bind the touch events only to the header area to prevent conflicting with scroll, which is the easiest and safest way to satisfy "toca no manipulador (handle) ou cabeçalho".

// Remove touch events from the main wrapper
content = content.replace(
  /          @touchstart\.passive="onTouchStart"\n          @touchmove\.passive="onTouchMove"\n          @touchend="onTouchEnd"/,
  ""
)

// Add touch events to the drag handle wrapper
content = content.replace(
  /<div class="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">/,
  '<div class="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onTouchEnd">'
)

fs.writeFileSync(file, content, 'utf8')
