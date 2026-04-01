import re

with open("src/shared/components/organisms/AppSidebar.vue", "r") as f:
    content = f.read()

# Let's ensure the root element of AppSidebar has 'hidden md:flex' or 'hidden md:block'
# Right now, MainLayout adds it, but let's check the root element of AppSidebar
if '<aside class="sidebar' in content and 'hidden md:flex' not in content:
    content = content.replace('<aside class="sidebar', '<aside class="sidebar hidden md:flex')

with open("src/shared/components/organisms/AppSidebar.vue", "w") as f:
    f.write(content)
