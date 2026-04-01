with open("src/shared/components/organisms/AppSidebar.vue", "r") as f:
    content = f.read()

if 'class="sidebar"' in content:
    content = content.replace('class="sidebar"', 'class="sidebar hidden md:flex"')

with open("src/shared/components/organisms/AppSidebar.vue", "w") as f:
    f.write(content)
