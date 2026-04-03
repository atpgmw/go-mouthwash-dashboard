import { supabase } from "@/lib/supabase";

type Contact = {
  Id: number;
  first_name: string;
  email: string;
  company: string | null;
  notes: string | null;
  lead_status: string | null;
  ready_to_email: boolean;
  sent: boolean;
};

async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("Contacts")
    .select("Id, first_name, email, company, notes, lead_status, ready_to_email, sent")
    .order("Id", { ascending: true });

  if (error) {
  throw new Error(`Supabase error: ${error.message}`);
}

  return data ?? [];
}

export default async function Home() {
  const contacts = await getContacts();

  const totalContacts = contacts.length;
  const readyToEmail = contacts.filter((c) => c.ready_to_email).length;
  const sentCount = contacts.filter((c) => c.sent).length;
  const pendingCount = contacts.filter((c) => !c.sent).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">GO Mouthwash CRM Dashboard</h1>
          <p className="text-slate-400 mt-2">Lead tracking overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm">Total Contacts</p>
            <p className="text-3xl font-semibold mt-2">{totalContacts}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm">Ready to Email</p>
            <p className="text-3xl font-semibold mt-2">{readyToEmail}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm">Sent</p>
            <p className="text-3xl font-semibold mt-2">{sentCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm">Pending</p>
            <p className="text-3xl font-semibold mt-2">{pendingCount}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-xl font-semibold">Contacts</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-300 text-sm">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Lead Status</th>
                  <th className="px-4 py-3">Ready</th>
                  <th className="px-4 py-3">Sent</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.Id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{contact.first_name}</td>
                    <td className="px-4 py-3 text-slate-300">{contact.email}</td>
                    <td className="px-4 py-3 text-slate-300">{contact.company ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{contact.lead_status ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          contact.ready_to_email
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {contact.ready_to_email ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          contact.sent
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {contact.sent ? "Sent" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
