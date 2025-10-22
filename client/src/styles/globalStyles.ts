// Simple styled components using Vue's defineComponent
// These are basic div wrappers with inline styles

export const PageContainer = 'div';
export const Card = 'div';
export const PageTitle = 'h1';
export const StatsCard = 'div';
export const StatsTitle = 'div';
export const StatsValue = 'div';
export const AuthContainer = 'div';
export const AuthCard = 'div';
export const AuthTitle = 'h1';
export const AuthSubtitle = 'p';

// CSS classes for styling (to be used with :class binding)
export const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f0f2f5',
    minHeight: 'calc(100vh - 64px)',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#262626',
    marginBottom: '24px',
  },
  statsCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  statsTitle: {
    fontSize: '14px',
    color: '#8c8c8c',
    marginBottom: '8px',
  },
  statsValue: {
    fontSize: '30px',
    fontWeight: '600',
    color: '#262626',
  },
  authContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  authCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  authTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#262626',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  authSubtitle: {
    fontSize: '14px',
    color: '#8c8c8c',
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
};
