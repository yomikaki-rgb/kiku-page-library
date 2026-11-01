import {readdir,writeFile,mkdir,copyFile,stat} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const out=path.join(root,'_site')
const sourceBooks=path.join(root,'books')
const outBooks=path.join(out,'books')
await mkdir(outBooks,{recursive:true})
await copyFile(path.join(root,'index.html'),path.join(out,'index.html'))
await writeFile(path.join(out,'.nojekyll'),'')
const entries=[]
for(const name of (await readdir(sourceBooks)).sort((a,b)=>a.localeCompare(b,'ja'))){
 if(!/\.pdf$/i.test(name))continue
 const source=path.join(sourceBooks,name)
 const info=await stat(source)
 if(!info.isFile())continue
 await copyFile(source,path.join(outBooks,name))
 entries.push({title:name.replace(/\.pdf$/i,''),file:`books/${encodeURIComponent(name)}`,bytes:info.size})
}
await writeFile(path.join(out,'library.json'),JSON.stringify(entries,null,2)+'\n')
console.log(`${entries.length}冊の図書館を作成しました。`)
