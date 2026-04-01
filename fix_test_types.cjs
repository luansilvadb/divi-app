const fs = require('fs')
const path = require('path')

const testFile = path.join(__dirname, 'src/shared/components/molecules/__tests__/BaseBottomSheet.spec.ts')
let testContent = fs.readFileSync(testFile, 'utf8')

testContent = testContent.replace(
  /\(wrapper\.vm as Record<string, unknown>\)/g,
  "(wrapper.vm as unknown as Record<string, unknown>)"
)

fs.writeFileSync(testFile, testContent, 'utf8')
