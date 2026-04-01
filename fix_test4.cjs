const fs = require('fs')
const path = require('path')

const testFile = path.join(__dirname, 'src/shared/components/molecules/__tests__/BaseBottomSheet.spec.ts')
let testContent = fs.readFileSync(testFile, 'utf8')

// The tests trigger drag on `.sheet-content` but now we moved the listener to the drag handle.
// We need to trigger it on the handle instead.
testContent = testContent.replace(
  /const content = wrapper\.find\('\.sheet-content'\)/g,
  "const content = wrapper.find('.cursor-grab')"
)

fs.writeFileSync(testFile, testContent, 'utf8')
