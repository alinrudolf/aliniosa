import logsIcon from '../../assets/images/logs-icon.png';
import { logsPage } from '../../data/logs';
import { SystemModule } from '../system/SystemModule';
import './LogsPage.css';

export function LogsPage({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`${mobile ? 'mobile-logs-page' : 'logs-page'} min-w-0 font-mono text-[color:var(--amber-base)]`}>
      <SystemModule
        id="logs"
        moduleId={logsPage.label}
        status={logsPage.status}
        title={<>{logsPage.title}<span className="logs-heading-cursor" aria-hidden="true">_</span></>}
        emptyState={{
          mobile,
          artwork: <img className="logs-artwork" src={logsIcon} width="681" height="529" alt="" />,
        }}
        blocks={[
          { label: logsPage.summaryLabel, value: <p className="font-bold text-[color:var(--amber-core)]">{logsPage.summary}</p> },
          { label: logsPage.descriptionLabel, value: <p>{logsPage.description}</p> },
        ]}
      />
    </div>
  );
}
