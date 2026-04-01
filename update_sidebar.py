import re

with open("src/shared/components/organisms/AppSidebar.vue", "r") as f:
    content = f.read()

# Modify the AppSidebar to be hidden on mobile natively or we can just let MainLayout handle it
# Wait, MainLayout is already using `class="hidden md:flex"`, but AppSidebar might have conflicting media queries.
# Let's remove the mobile specific media query in AppSidebar.vue

content = re.sub(r'/\* ===== Responsive ===== \*/\s*@media \(max-width: 768px\) \{\s*\.sidebar \{\s*position: fixed;\s*left: 0;\s*top: 0;\s*z-index: 100;\s*\}\s*\}\s*', '', content)

with open("src/shared/components/organisms/AppSidebar.vue", "w") as f:
    f.write(content)
