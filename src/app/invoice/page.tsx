"use client";
import {useEffect,useState} from "react";import {useRouter} from "next/navigation";import Link from "next/link";import {ArrowLeft,Printer,Trash2} from "lucide-react";import Topbar from "@/components/Topbar";import InvoicePaper from "@/components/InvoicePaper";import {Invoice} from "@/lib/types";import {getInvoice,deleteInvoice} from "@/lib/storage";
export default function InvoiceView(){const router=useRouter(); const [id,setId]=useState("");const [v,setV]=useState<Invoice|null>(null),[error,setError]=useState("");
 useEffect(()=>{const invoiceId=new URLSearchParams(window.location.search).get("id")||"";setId(invoiceId);if(!invoiceId){setError("ID nota tidak ditemukan.");return;}const found=getInvoice(invoiceId);if(found)setV(found);else setError("Nota tidak ditemukan di penyimpanan perangkat ini.")},[]);
 async function printInvoice(){
  // Tunggu font dan logo selesai dimuat agar preview cetak tidak kosong/bergeser.
  try { if ("fonts" in document) await document.fonts.ready; } catch {}
  const images=Array.from(document.querySelectorAll<HTMLImageElement>(".print-sheet img"));
  await Promise.all(images.map(img=>img.complete?Promise.resolve():new Promise<void>(resolve=>{img.addEventListener("load",()=>resolve(),{once:true});img.addEventListener("error",()=>resolve(),{once:true});setTimeout(resolve,2500);} )));
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()));
 }
 async function del(){if(!confirm("Hapus nota ini secara permanen?"))return;deleteInvoice(id);router.push("/")}
 return <div className="shell"><Topbar back/><main className="page"><div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:24}}><div><div className="eyebrow">DOCUMENT PREVIEW</div><h1 style={{fontSize:40,margin:"8px 0"}}>Preview nota.</h1></div><div style={{display:"flex",gap:10}}><button className="btn btn-primary" onClick={printInvoice}><Printer size={17}/> Print Nota</button><button className="btn" onClick={del}><Trash2 size={17}/></button></div></div>{error&&<div className="card" style={{padding:20}}>{error}</div>}{!v&&!error&&<div className="card empty">Memuat nota...</div>}{v&&<><div className="no-print" style={{textAlign:"center",marginBottom:16}}><span className="badge">UKURAN CETAK: {v.paper_size}</span></div><div className="print-root"><InvoicePaper invoice={v}/></div></>}</main></div>
}
