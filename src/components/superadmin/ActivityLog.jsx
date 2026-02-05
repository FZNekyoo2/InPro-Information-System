
import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../services/adminService';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading logs...</div>;

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <h2>📜 Log Aktivitas</h2>
        <button className="btn btn-secondary btn-sm" onClick={fetchLogs}>🔄 Refresh</button>
      </div>
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', color: '#666' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-info">{log.username}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{log.action}</span>
                  </td>
                  <td>{log.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">Belum ada aktivitas tercatat.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
