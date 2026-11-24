filepath = 'src/components/admin/PatientDossierDrawer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

target = "status: 'confirmed' | 'in_surgery' | 'completed' | 'cancelled' | 'pending';"
replace = "status: 'confirmed' | 'arrived' | 'in_surgery' | 'completed' | 'cancelled' | 'pending';"

if target in c:
    c = c.replace(target, replace, 1)
    print("Updated status type!")
else:
    print("Target status not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
