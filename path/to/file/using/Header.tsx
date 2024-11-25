import dynamic from 'next/dynamic'

const Header = dynamic(() => import('./path/to/Header'), {
  loading: () => <p>Loading...</p>
})
