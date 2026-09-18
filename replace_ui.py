with open("src/main/resources/static/js/app.js", "r", encoding="utf-8") as file:
    content = file.read()

content = content.replace("role === 'supervisor'", "role === 'site_engineer'")
content = content.replace("role === 'inventory supervisor' || role === 'store and inventory supervisor'", "role === 'inventory_manager'")
content = content.replace("inventory_officer", "inventory_manager")

with open("src/main/resources/static/js/app.js", "w", encoding="utf-8") as file:
    file.write(content)

with open("src/main/resources/static/index.html", "r", encoding="utf-8") as file:
    content = file.read()

content = content.replace('"supervisor"', '"site_engineer"')
content = content.replace('"supervisor,', '"site_engineer,')
content = content.replace(',supervisor"', ',site_engineer"')
content = content.replace('inventory_officer', 'inventory_manager')

with open("src/main/resources/static/index.html", "w", encoding="utf-8") as file:
    file.write(content)
