import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addEvent } from '../../store/slices/eventsSlice';
import { Calendar, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stepper from '../../components/shared/Stepper';
import FadeIn from '../../components/animations/FadeIn';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    latitude: z.number(),
    longitude: z.number(),
  }),
  startDate: z.string().refine(date => new Date(date) > new Date(), {
    message: 'Start date must be in the future',
  }),
  endDate: z.string().refine(date => new Date(date) > new Date(), {
    message: 'End date must be in the future',
  }),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  requirements: z.string(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const steps = [
  { id: 'basics', title: 'Basic Info' },
  { id: 'details', title: 'Event Details' },
  { id: 'requirements', title: 'Requirements' },
  { id: 'review', title: 'Review' },
];

function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const organization = useSelector((state: RootState) =>
    state.organizations.organizations.find(org => org.id === organizationId)
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
  });

  const formData = watch();

  const handleNextStep = async () => {
    const fieldsToValidate = {
      0: ['title', 'description'],
      1: ['startDate', 'endDate', 'capacity'],
      2: ['location.address', 'requirements'],
    }[currentStep];

    if (fieldsToValidate) {
      const isStepValid = await trigger(fieldsToValidate as any);
      if (isStepValid) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = (data: EventFormData) => {
    if (!organizationId) return;

    const newEvent = {
      id: `event-${Date.now()}`,
      ...data,
      organizationId,
      registeredVolunteers: [],
      status: 'upcoming' as const,
      createdBy: 'admin1', // Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addEvent(newEvent));
    navigate(`/events/${newEvent.id}`);
  };

  if (!organization) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Organization Not Found</h2>
        <p className="text-gray-500 mt-2">The organization you're trying to create an event for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
        <p className="mt-2 text-gray-600">Schedule a new volunteer event for {organization.name}.</p>
      </div>

      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
        {currentStep === 0 && (
          <FadeIn>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={4}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the event and its goals"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {currentStep === 1 && (
          <FadeIn>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      {...register('startDate')}
                      className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      {...register('endDate')}
                      className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Volunteer Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    {...register('capacity', { valueAsNumber: true })}
                    min="1"
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {currentStep === 2 && (
          <FadeIn>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    {...register('location.address')}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Event location address"
                  />
                  {errors.location?.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    {...register('requirements')}
                    rows={3}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="List any special requirements or items volunteers should bring"
                  />
                  {errors.requirements && (
                    <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {currentStep === 3 && (
          <FadeIn>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Event Title</p>
                    <p className="text-sm">{formData.title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm">
                      From {new Date(formData.startDate).toLocaleString()} to{' '}
                      {new Date(formData.endDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{formData.location.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-sm">{formData.capacity} volunteers</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{formData.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                  <p className="text-sm text-gray-600">{formData.requirements}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <div className="flex justify-between space-x-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:-translate-y-0.5"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:-translate-y-0.5"
            >
              Create Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;