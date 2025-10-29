import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LeaveCalendar from '../LeaveCalendar.vue';
import type { Leave } from '@/types';

describe('LeaveCalendar Component', () => {
  const mockLeaves: Leave[] = [
    {
      _id: '1',
      userId: {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        role: 'employee',
        leaveBalance: 20,
      },
      startDate: '2025-10-25',
      endDate: '2025-10-27',
      leaveType: 'sick',
      reason: 'Flu',
      status: 'pending',
      daysCount: 3,
      createdAt: '2025-10-20',
      updatedAt: '2025-10-20',
    },
    {
      _id: '2',
      userId: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@test.com',
        role: 'employee',
        leaveBalance: 15,
      },
      startDate: '2025-11-01',
      endDate: '2025-11-03',
      leaveType: 'annual',
      reason: 'Vacation',
      status: 'approved',
      daysCount: 3,
      createdAt: '2025-10-28',
      updatedAt: '2025-10-28',
    },
  ];

  it('should render calendar component', () => {
    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: mockLeaves,
      },
    });

    expect(wrapper.find('.calendar-container').exists()).toBe(true);
  });

  it('should accept leaves prop', () => {
    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: mockLeaves,
      },
    });

    expect(wrapper.props('leaves')).toEqual(mockLeaves);
  });

  it('should accept onEventClick callback prop', () => {
    const mockCallback = vi.fn();
    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: mockLeaves,
        onEventClick: mockCallback,
      },
    });

    expect(wrapper.props('onEventClick')).toBe(mockCallback);
  });

  it('should convert leaves to calendar events with correct colors', () => {
    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: mockLeaves,
      },
    });

    const vm = wrapper.vm as any;
    const events = vm.events;

    expect(events).toHaveLength(2);
    
    // Pending leave should be orange
    expect(events[0].color).toBe('#faad14');
    
    // Approved leave should be green
    expect(events[1].color).toBe('#52c41a');
  });

  it('should format event titles correctly', () => {
    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: mockLeaves,
      },
    });

    const vm = wrapper.vm as any;
    const events = vm.events;

    expect(events[0].title).toBe('Sick - John Doe');
    expect(events[1].title).toBe('Annual - Jane Smith');
  });

  it('should handle rejected leave with red color', () => {
    const rejectedLeave: Leave = {
      _id: '3',
      userId: {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        role: 'employee',
        leaveBalance: 20,
      },
      startDate: '2025-10-15',
      endDate: '2025-10-17',
      leaveType: 'casual',
      reason: 'Personal',
      status: 'rejected',
      daysCount: 3,
      createdAt: '2025-10-10',
      updatedAt: '2025-10-12',
    };

    const wrapper = mount(LeaveCalendar, {
      props: {
        leaves: [rejectedLeave],
      },
    });

    const vm = wrapper.vm as any;
    const events = vm.events;

    expect(events[0].color).toBe('#ff4d4f');
  });
});
