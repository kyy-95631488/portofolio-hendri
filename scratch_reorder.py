import re

file_path = r'd:\ALERT\CODING\WebArea\portfolio-hendri\src\app\nexus-hq\projects\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change max-w-2xl to max-w-6xl
content = content.replace('className="relative w-full max-w-2xl', 'className="relative w-full max-w-6xl')

# 2. Extract sections
# Find title/link section
title_link_start = content.find('<div className="grid grid-cols-1 md:grid-cols-2 gap-5">')
title_link_end = content.find('<div className="space-y-4 border border-white/10 p-4 rounded-xl bg-white/5">')

title_link_html = content[title_link_start:title_link_end]

# Google drive + Thumb + Views ends before Tags
tags_start_str = '<div className="space-y-2">\n                      <label className="text-sm font-medium text-gray-300">Tags (comma separated)</label>'
tags_start = content.find(tags_start_str)

media_html = content[title_link_end:tags_start]

# Tags + Render Mode + Description ends before Save button
save_start_str = '<div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">'
save_start = content.find(save_start_str)

info_html = content[tags_start:save_start]

save_html = content[save_start:content.find('</form>') + 7]

form_prefix = content[:title_link_start]
form_suffix = content[content.find('</form>') + 7:]

# Replace form tag
form_prefix = form_prefix.replace('<form onSubmit={handleSave} className="space-y-5">', 
    '<form onSubmit={handleSave} className="flex flex-col max-h-[75vh]">\n' +
    '                    <div className="flex-1 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">\n' +
    '                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">\n' +
    '                        {/* LEFT COLUMN: Info & Details (span 7) */}\n' +
    '                        <div className="lg:col-span-7 space-y-6">')

# After title/link and info, close left col and open right col
new_form = (
    form_prefix + 
    title_link_html + 
    info_html + 
    '                        </div>\n\n                        {/* RIGHT COLUMN: Media & Assets (span 5) */}\n                        <div className="lg:col-span-5 space-y-6">\n' +
    media_html + 
    '                        </div>\n                      </div>\n                    </div>\n\n' +
    save_html +
    form_suffix
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_form)
print("Success")
