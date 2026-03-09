exports.maskEmail = (email) => {
    if (!email) return "";
        const [id, domain] = String(email).split("@");
    if (!domain) return "***";
        return `${id.slice(0, 2)}***@${domain}`;
}

exports.safeHashInfo = (hash) => {
    const s = String(hash || "");
    return {
        prefix: s.slice(0,4),
        len: s.length,
    }
}