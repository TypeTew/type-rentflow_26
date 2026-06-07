import { BrowserWindow as e, app as t } from "electron";
import n from "path";
import { fileURLToPath as r } from "url";
//#region electron/main.ts
var i = r(import.meta.url), a = n.dirname(i), o, s = () => {
	o = new e({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: !1,
			contextIsolation: !0,
			sandbox: !0
		},
		title: "RentFlow",
		icon: n.join(a, "../public/favicon.ico")
	});
	let r = n.join(a, "../dist/index.html");
	console.log("Loading:", r), t.isPackaged ? o.loadFile(r).catch((e) => {
		console.error("Failed to load:", e);
	}) : (o.loadURL("http://localhost:5173"), o.webContents.openDevTools()), o.webContents.on("did-fail-load", (e, t, n) => {
		console.error("Failed to load:", t, n);
	}), o.on("closed", () => {
		o = null;
	});
};
t.whenReady().then(() => {
	s(), t.on("activate", () => {
		e.getAllWindows().length === 0 && s();
	});
}), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
});
//#endregion

//# sourceMappingURL=main.js.map