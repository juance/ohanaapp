
# Component Refactoring Guide

This guide provides principles and patterns for refactoring components in the Lavandería Ohana application.

## When to Refactor

Consider refactoring components when:

1. A component exceeds 100-150 lines of code
2. A component has multiple unrelated responsibilities
3. The same logic is duplicated across components
4. State management becomes complex within a component
5. Testing a component is difficult due to its complexity

## Component Organization Patterns

### 1. Container/Presenter Pattern

Split components into two parts:

- **Container**: Handles data fetching, state management, and business logic
- **Presenter**: Focused solely on rendering UI based on props

#### Example:

```tsx
// Container
const TicketListContainer = () => {
  const { data, isLoading, error } = useTickets();
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorMessage error={error} />;
  
  return <TicketList tickets={data} />;
};

// Presenter
const TicketList = ({ tickets }) => (
  <div className="space-y-4">
    {tickets.map(ticket => (
      <TicketItem key={ticket.id} ticket={ticket} />
    ))}
  </div>
);
```

### 2. Custom Hooks for Logic Extraction

Move complex logic into custom hooks:

```tsx
// Before
const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  // Complex date filtering logic...
  
  return (
    // UI rendering
  );
};

// After
const Dashboard = () => {
  const { startDate, endDate, setStartDate, setEndDate, filteredData } = 
    useDateRangeFilter(data);
  
  return (
    // Simpler UI rendering with hook results
  );
};
```

### 3. Composition Over Configuration

Build complex components through composition of smaller ones:

```tsx
// Instead of one large component
const UserProfileWithSettings = () => (
  <Card>
    <CardHeader>
      <ProfileHeader />
    </CardHeader>
    <CardContent>
      <ProfileDetails />
      <ProfileStats />
    </CardContent>
    <CardFooter>
      <ProfileActions />
    </CardFooter>
  </Card>
);
```

## Extracting Components Checklist

When extracting a component, ensure:

1. The new component has a single, clear responsibility
2. Props are well-defined with TypeScript interfaces
3. The component is tested independently
4. The naming clearly communicates the component's purpose
5. Default props are provided for optional values

## State Management Recommendations

- Use local component state for UI-only concerns
- Use React Context for sharing state between closely related components
- Consider React Query for server state management
- Keep state as close as possible to where it's used

## Folder Structure Recommendations

Organize related components in feature folders:

```
src/
  components/
    ticket/
      TicketList.tsx
      TicketItem.tsx
      TicketForm.tsx
    customer/
      CustomerSearch.tsx
      CustomerDetails.tsx
    ui/
      Card.tsx
      Button.tsx
```

## Practical Example

### Before Refactoring

```tsx
const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Fetch tickets, search, sort and error handling logic...
  
  return (
    <div>
      <h1>Tickets</h1>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Toggle Sort
      </button>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {filteredTickets.map(ticket => (
            <li key={ticket.id}>
              {/* Ticket display logic */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### After Refactoring

```tsx
// Custom hook
const useTickets = (searchTerm, sortOrder) => {
  // Fetch, search, sort and error handling logic...
  return { tickets: filteredTickets, loading, error };
};

// Presenter components
const TicketSearch = ({ value, onChange }) => (
  <input 
    type="text" 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search tickets..."
  />
);

const SortToggle = ({ sortOrder, onToggle }) => (
  <button onClick={onToggle}>
    Sort {sortOrder === 'asc' ? '↑' : '↓'}
  </button>
);

const TicketList = ({ tickets }) => (
  <ul className="space-y-4">
    {tickets.map(ticket => (
      <TicketItem key={ticket.id} ticket={ticket} />
    ))}
  </ul>
);

// Container component
const TicketPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const { tickets, loading, error } = useTickets(searchTerm, sortOrder);
  
  const handleToggleSort = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  
  return (
    <div>
      <h1>Tickets</h1>
      
      <div className="flex space-x-4">
        <TicketSearch value={searchTerm} onChange={setSearchTerm} />
        <SortToggle sortOrder={sortOrder} onToggle={handleToggleSort} />
      </div>
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
};
```

By following these patterns, components become more focused, reusable, and easier to maintain.
