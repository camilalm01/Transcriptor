import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";

import { useParams } from "react-router-dom";
import { usePendingMembers } from "../hooks/usePendingMembers";
import { useMemberActions } from "../hooks/useMemberActions";

import Button from "../../../shared/components/ui/buttons/Button";

export default function SpaceMembersPage() {

  const { spaceId = "" } =
    useParams();

  const {
    data: pending = [],
  } = usePendingMembers(
    spaceId
  );

  const {
    approveMember,
    rejectMember,
  } = useMemberActions(
    spaceId
  );

  return (
    <MainLayout>

      <Header
        title="Solicitudes"
        showBackButton
      />

      <div className="p-4 space-y-4">

        {pending.map(
          member => (
            <div
              key={member.userId}
              className="
                rounded-xl
                border
                p-4
              "
            >
              <p>
                {member.name}
              </p>

              <p className="text-sm text-gray-500">
                {member.email}
              </p>

              <div className="flex gap-2 mt-3">

                <Button
                  onClick={() =>
                    approveMember.mutate(
                      member.userId
                    )
                  }
                >
                  Aprobar
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    rejectMember.mutate(
                      member.userId
                    )
                  }
                >
                  Rechazar
                </Button>

              </div>
            </div>
          )
        )}

      </div>

    </MainLayout>
  );
}