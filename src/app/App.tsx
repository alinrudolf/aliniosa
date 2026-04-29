import { HeaderModule } from '../components/layout/HeaderModule';
import { SectionFrame } from '../components/layout/SectionFrame';
import { SiteShell } from '../components/layout/SiteShell';
import { InstallationModule } from '../components/installations/InstallationModule';
import { MovieLibrary } from '../components/library/MovieLibrary';
import { LogEntry } from '../components/logs/LogEntry';
import { SignalMonitorNav } from '../components/signal/SignalMonitorNav';
import { SystemModule } from '../components/system/SystemModule';
import { installations } from '../data/installations';
import { logs } from '../data/logs';
import { movies } from '../data/movies';
import { siteHeader } from '../data/navigation';
import { contactRecords, homepageModules, systemRecords, workRecords } from '../data/work';

export function App() {
  return (
    <SiteShell>
      <HeaderModule header={siteHeader} />
      <SignalMonitorNav />
      <SectionFrame>
        <SystemModule
          id="system"
          moduleId={homepageModules.system.moduleId}
          status={homepageModules.system.status}
          title={homepageModules.system.title}
          blocks={systemRecords.map((record) => ({ label: record.label, value: record.value }))}
          command={homepageModules.system.command}
        />
        <SystemModule
          id="work"
          moduleId={homepageModules.work.moduleId}
          status={homepageModules.work.status}
          title={homepageModules.work.title}
          blocks={workRecords.map((record) => ({
            label: record.label,
            value: record.value,
          }))}
          command={homepageModules.work.command}
        />
        <SystemModule
          id="installations"
          moduleId={homepageModules.installations.moduleId}
          status={homepageModules.installations.status}
          title={homepageModules.installations.title}
          blocks={[
            {
              label: homepageModules.installations.label,
              value: (
                <div className="grid gap-5">
                  {installations.map((installation) => (
                    <InstallationModule key={installation.id} installation={installation} />
                  ))}
                </div>
              ),
            },
          ]}
          command={homepageModules.installations.command}
        />
        <SystemModule
          id="library"
          moduleId={homepageModules.library.moduleId}
          status={homepageModules.library.status}
          title={homepageModules.library.title}
          blocks={[
            {
              label: homepageModules.library.label,
              value: <MovieLibrary movies={movies} />,
            },
          ]}
          command={homepageModules.library.command}
        />
        <SystemModule
          id="logs"
          moduleId={homepageModules.logs.moduleId}
          status={homepageModules.logs.status}
          title={homepageModules.logs.title}
          blocks={[
            {
              label: homepageModules.logs.label,
              value: (
                <div className="grid gap-5">
                  {logs.map((log) => (
                    <LogEntry key={log.id} log={log} />
                  ))}
                </div>
              ),
            },
          ]}
          command={homepageModules.logs.command}
        />
        <SystemModule
          id="contact"
          moduleId={homepageModules.contact.moduleId}
          status={homepageModules.contact.status}
          title={homepageModules.contact.title}
          blocks={contactRecords.map((record) => ({ label: record.label, value: record.value }))}
          command={homepageModules.contact.command}
        />
      </SectionFrame>
    </SiteShell>
  );
}
